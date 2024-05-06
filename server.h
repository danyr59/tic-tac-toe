#ifndef __SERVER__
#define __SERVER__

//#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <poll.h>

#include <thread>
#include <string>
#include <vector>
#include <mutex>

#include <nlohmann/json.hpp>
#include "util.h"

#define BUFFER_SIZE 1024
#define MAX_CLIENTS 10

using json = nlohmann::json;

class Server
{
private:
    /* data */
    int lis_sockfd;
    int  *cli_sockfd; 
    std::vector<int> list_client;
    std::mutex mtx_client;
    std::mutex mtx_fds;
    struct pollfd fds[MAX_CLIENTS];
    int nfds, value_read;
    char buffer[BUFFER_SIZE] = {0};
    std::thread * hilo;
    bool listen_data;

public:
    Server(int port);
    ~Server();

    bool send_message(int cli_sockfd, json msg);
    void set_up_room(int , int *);
    void start();
    bool set_up_connection();
    void set_listen();
    json read_data(int);
    void add_client(int);
    void manage_data(json);
    bool autenticar(const int &, const int &);

};

#endif