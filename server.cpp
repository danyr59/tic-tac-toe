#include "server.h"

Server::Server(int port) : list_client(), mtx_client(), mtx_fds() //, list_room()
{

    struct sockaddr_in serv_addr;
    hilo = nullptr;

    value_read = nfds = 0;
    listen_data = true;

    lis_sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (lis_sockfd < 0)
    {
    }
    // error("ERROR opening listener socket.");

    // Inicializar todos los elementos de fds a -1 y eventos a POLLIN
    for (int i = 0; i < MAX_CLIENTS; i++)
    {
        fds[i].fd = -1;
        fds[i].events = POLLIN;
    }

    // memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = INADDR_ANY;
    serv_addr.sin_port = htons(port);

    if (bind(lis_sockfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0)
    {
    }
    // error("ERROR binding listener socket.");
}

void Server::start()
{

    while (true)
    {
        if (list_client.size() < MAX_CLIENTS)
        {
            set_up_connection();
        }
    }
}

bool Server::send_message(const int &cli_sockfd, json data)
{
    std::string msg = data.dump();
    int n = write(cli_sockfd, msg.c_str(), strlen(msg.c_str()));
    if (n < 0)
        return false;
    return true;
}

bool Server::create_room(const std::string &key, const int &fd)
{
    auto find = list_room.find(key);
    if (find == list_room.end())
    {
        list_room[key] = std::make_unique<Room>(fd, key, [this] (const int & client_o, const int &client_x, std::string key){
            this->close_room(client_o, client_x, key);
        });

        return true;
    }

    return false;
}

bool Server::choose_room(const std::string &key, const int &fd)
{
    auto find = list_room.find(key);
    if (find != list_room.end() && find->second->available)
    {
        mtx_fds.lock();
        find->second->Init(fd, fds, nfds);
        mtx_fds.unlock();
        return true;
    }

    return false;
}

json Server::read_data(int cli_fd)
{
    json js;
    js["action"] = -1;
    value_read = read(cli_fd, buffer, BUFFER_SIZE);
    buffer[value_read] = '\0';
    std::string str_json = buffer;
    if (value_read == 0)
        return js;
    try
    {
        js = json::parse(str_json);
        // std::cout << js["dato"] << " : " << js["dato2"] << std::endl;
    }
    catch (const std::exception &e)
    {
        std::cerr << e.what() << '\n';
    }
    return js;
}

void Server::manage_data(json j, const int &fd)
{
    if (j.find("action") != j.end())
    {
        int action = j["action"];
        switch (action)
        {
        case ACTION::NEW_ROOM:
        {
            clear_rooms();
            std::string key = j["key_room"];
            json res = {{"action", static_cast<int>(ACTION::NEW_ROOM)}};
            if (create_room(key, fd))
            {
                res["status"] = 1;
            }
            else
            {
                res["status"] = 0;
            }

            send_message(fd, res);
            break;
        }
        case ACTION::CHOOSE_ROOM:
        {
            std::string key = j["key_room"];
            json res = {{"action", static_cast<int>(ACTION::CHOOSE_ROOM)}};

            if (choose_room(key, fd))
            {
                res["status"] = 1;
            }
            else
            {
                res["status"] = 0;
                send_message(fd, res);
            }

            break;
        }
        case ACTION::SELECT_MOVEMENT:
        {
            // Aquí va el código para manejar la acción SELECT_MOVEMENT
            break;
        }
        case ACTION::OUT_ROOM:
        {
            // Aquí va el código para manejar la acción OUT_ROOM
            break;
        }
        case ACTION::OUT_GAME:
        {
            // Aquí va el código para manejar la acción OUT_GAME
            break;
        }
        case ACTION::LIST_ROOM:
        {
            // Aquí va el código para manejar la acción LIST_ROOM
            clear_rooms();
            std::vector<std::string> list = get_room_list();
            json j = {{"action", static_cast<int>(ACTION::LIST_ROOM)}};
            j["list"] = {};

            for (const std::string &s : list)
                j["list"].push_back(s);

            send_message(fd, j);

            break;
        }
        default:
        {

            break;
        }
        }
    }
}

std::vector<std::string> Server::get_room_list()
{
    std::vector<std::string> list;
    for (const auto &r : list_room)
    {
        list.push_back(r.first);
    }

    return list;
}

void Server::set_listen()
{
    while (listen_data)
    {
        // mtx_fds.lock();
        int activity = poll(fds, nfds, 5);
        if (activity < 0)
        {
            perror("poll error");
            exit(EXIT_FAILURE);
        }

        for (int i = 0; i < nfds; i++)
        {
            if (fds[i].revents & POLLIN)
            {
                json data = read_data(fds[i].fd);
                if (value_read > 0)
                {
                    manage_data(data, fds[i].fd);
                }
                else
                {
                    mtx_fds.lock();
                    // El cliente se desconectó o hubo un error
                    close(fds[i].fd);
                    fds[i].fd = -1;
                    mtx_fds.unlock();
                }
            }
        }
    }
}

void Server::add_client(int fd_client, bool new_client)
{
    // Añadir el nuevo socket al array de fds
    int i;
    mtx_fds.lock();
    for (i = 0; i < MAX_CLIENTS; i++)
    {
        if (fds[i].fd == -1)
        {
            fds[i].fd = fd_client;
            break;
        }
    }

    std::cout << "cliente: " << i << std::endl;
    if(new_client)
        autenticar(fd_client, i);
    else
        reinsertar(fd_client, i);
    list_client.push_back(fd_client);
    ++nfds;
    mtx_fds.unlock();
}

bool Server::autenticar(const int &fd_client, const int &id)
{
    json data = {
        {"action", static_cast<int>(ACTION::AUTHENTICATION)},
        {"id", id},

    };

    send_message(fd_client, data);
}
void Server::reinsertar(const int &fd_client, const int &id)
{
    json data = {
        {"action", static_cast<int>(ACTION::OUT_ROOM)},
        {"id", id},

    };

    send_message(fd_client, data);
}

// conexion individual
bool Server::set_up_connection()
{
    socklen_t clilen;

    struct sockaddr_in serv_addr, cli_addr;

    if (listen(lis_sockfd, MAX_CLIENTS) < 0)
    {
        perror("listen");
        exit(EXIT_FAILURE);
    }
    clilen = sizeof(cli_addr);

    int client_id = accept(lis_sockfd, (struct sockaddr *)&cli_addr, &clilen);
    if (client_id < 0)
    {
        std::cerr << "ERROR accepting a connection from a client."
                  << ": " << std::strerror(errno) << std::endl;
        return false;
    }

    add_client(client_id);
    // autenticacion (crear id)

    // seleccionar

    if (hilo == nullptr)
        hilo = new std::thread(&Server::set_listen, this);

    return true;
}

Server::~Server()
{
    clear_rooms();
    if (hilo->joinable())
    {
        hilo->join();
    }

    delete hilo;
}

void Server::close_room(const int &client_x, const int &client_o, std::string &key_room)
{
    if(client_o != -1)
        add_client(client_o, false);
    if(client_x != -1)
        add_client(client_x, false);

    if(closed_rooms.size() == 0)
    {
        closed_rooms.push_back(key_room);
        return;
    }

    auto result = std::find(closed_rooms.begin(), closed_rooms.end(), key_room);

    if(result == closed_rooms.end())
        closed_rooms.push_back(key_room);

}

void Server::clear_rooms()
{
    if(list_room.size() == 0 || closed_rooms.size() == 0)
        return;

    for(const std::string &key : closed_rooms)
        list_room.erase(key);

    closed_rooms.clear();
}