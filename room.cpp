#include "room.h"

Room::Room(const int &cl_o) : client_o(cl_o), client_x(-1), num_fds(2)
{
    memset(table, -1, sizeof(table));
    available = true;
}

void Room::Init(const int &cl_x, struct pollfd *_fds, int &fds_tam)
{

    client_x = cl_x;
    available = false;
    for (int i = 0; i < fds_tam; ++i)
    {
        if (_fds[i].fd == client_o || _fds[i].fd == client_x)
        {
            _fds[i].fd = -1;
        }
    }

    fds[0].fd = client_o;
    fds[0].events = POLLIN;
    fds[1].fd = client_x;
    fds[1].events = POLLIN;

    json j = {{"action", ACTION::START_GAME}};
    j["rol"] = 0;
    send_message(client_o, j);
    j["rol"] = 1;
    send_message(client_x, j);
    turn = false;
    listening = true;
    send_update();
    if (hilo == nullptr)
        hilo = new std::thread(&Room::set_listen, this);
}

json Room::read_data(int cli_fd, int &value_read)
{
    json js;
    js["action"] = -1;
    char buffer[BUFFER_SIZE] = {0};
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

short Room::catch_move(const int &move, const int & fd)
{
    if((turn && client_x != fd) || (!turn && client_o != fd))
        return 1;
 

    if(table[move / 3][move % 3] != -1)
        return 2;

    table[move / 3][move % 3] = turn;

    if(turn)
        turn = false;
    else
        turn = true;
    
    return 0;
    // 3 / move  ->  filas
    // move % 3 ->  columnas
    //example (move=0) 0/3 = 0 y 1 % 3 = 0 
    //example (move=5) 4/3 = 1.33  y 4 % 3 =1
    //example (move=3) 3/3 = 1  y 3 % 3 =0
    //example (move=2) 2/3 =0.66  y 2 % 3 =2
    // (0,0)  (0,1)  (0,2)
    // (1,0)  (1,1)  (1,2)
    // (2,0)  (2,1)  (2,2)

}

void Room::set_listen()
{
    while (listening)
    {
        // mtx_fds.lock();
        int activity = poll(fds, num_fds, -1);
        if (activity < 0)
        {
            perror("poll error");
            exit(EXIT_FAILURE);
        }

        for (int i = 0; i < num_fds; i++)
        {
            if (fds[i].revents & POLLIN)
            {
                int value_read;
                json data = read_data(fds[i].fd, value_read);
                if (value_read > 0)
                {

                    manage_data(data, fds[i].fd);
                }
                
            }
        }
    }
}

Room::~Room()
{
    if (hilo->joinable())
    {
        close(fds[0].fd);
        close(fds[1].fd);
        hilo->join();
        delete hilo;
    }
}

void Room::manage_data(json j, const int &fd)
{
    if (j.find("action") != j.end())
    {
        int action = j["action"];
        switch (action)
        {
        case ACTION_GAME::MOVE:
        {
            int move = j["move"];
            catch_move(move, fd);
            send_update();
            break;
        }
        case ACTION_GAME::CLOSE:
        {
            
            break;
        }
        case ACTION_GAME::RESTART:
        {
            memset(table, -1, sizeof(table));
            turn = false;
            send_update();
            // Aquí va el código para manejar la acción SELECT_MOVEMENT
            break;
        }

        default:
        {

            break;
        }
        }
    }
}

void Room::send_update()
{
    json res;
    res["action"] = ACTION_GAME::UPDATE;
    res["table"] = {{table[0][0], table[0][1], table[0][2]},
                    {table[1][0], table[1][1], table[1][2]}, 
                    {table[2][0], table[2][1], table[2][2]}};
    res["turn"] = turn;
    send_message(client_o, res);
    send_message(client_x, res);
}


bool Room::send_message(const int &cli_sockfd, json data)
{
    std::string msg = data.dump();
    int n = write(cli_sockfd, msg.c_str(), strlen(msg.c_str()));
    if (n < 0)
        return false;
    return true;
}
