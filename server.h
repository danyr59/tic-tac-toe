#ifndef __SERVER__
#define __SERVER__

#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>


#include <string>
#include <vector>
#include <mutex>

#include "util.h"

#define MAX_CONNECTIONS 50

class Server
{
private:
    /* data */
    int lis_sockfd;
    int  *cli_sockfd; 
    std::vector<int> list_client;
    std::mutex mtx_client;
public:
    Server(int port);
    ~Server();

    bool send_message(int cli_sockfd, std::string msg);
    void set_up_room(int , int *);
    void start();
    bool set_up_connection();
    void receve(int cli_sockfd);

};

#endif