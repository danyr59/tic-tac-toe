#include "server.h"

Server::Server(int port) : list_client(), mtx_client()
{
    
    struct sockaddr_in serv_addr;
    hilo = nullptr;

    value_read = nfds = 0;

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

bool Server::send_message(int cli_sockfd, std::string msg)
{
    int n = write(cli_sockfd, msg.c_str(), strlen(msg.c_str()));
    if (n < 0)
        return false;
    return true;
}

void Server::set_up_room(int listening_sockeck_fd, int *client_socket_fd)
{
}

void Server::read_data(int cli_sockfd)
{
    char msg[1024] = {0};
    int n = read(cli_sockfd, msg, 1024);

    if (n < 0 || n == 0)
        return;
    // return -1;
    printf("[DEBUG] Received: %s\n", msg);
    /* code */
}

void Server::receve()
{
    while (true)
    {
        int activity = poll(fds, nfds, -1);
         if (activity < 0) {
            perror("poll error");
            exit(EXIT_FAILURE);
        }

        for (int i = 0; i < nfds; i++)
        {
            if (fds[i].revents & POLLIN)
            {
                value_read = read(fds[i].fd, buffer, BUFFER_SIZE);
                if (value_read > 0)
                {
                    buffer[value_read] = '\0';
                    printf("Datos recibidos del cliente %d: %s\n", i, buffer);
                }
                else
                {
                    // El cliente se desconectó o hubo un error
                    close(fds[i].fd);
                    fds[i].fd = -1;
                }
            }
        }
    }
    
    
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

    std::cout << "cliente: " << client_id << std::endl;

    list_client.push_back(client_id);
    send_message(client_id, "hola");

    fds[nfds].fd = client_id;
    ++nfds;
    
    if(nfds == 1)
        hilo = new std::thread(&Server::receve, this);

    return true;
}

Server::~Server()
{
    if(hilo->joinable())
    {
        hilo->join();
    }

    delete hilo;
}
