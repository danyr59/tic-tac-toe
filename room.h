#ifndef __ROOM__
#define __ROOM__
#include "util.h"
#include <poll.h>
#include <unistd.h>
#include <thread>

#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>

#include <nlohmann/json.hpp>

using json = nlohmann::json;

class Room
{
private:

    // libre -> -1
    // O -> 0 
    // x -> 1
    short table[3][3];
    //false client o
    //true client x
    bool turn, listening;
    int client_o;
    int client_x;
    int num_fds;
    std::thread * hilo;
    struct pollfd fds[2];

public:
    bool available;
    Room(const int &);
    ~Room();
    json read_data(int, int &);
    void Init(const int &, struct pollfd *, int &);
    void set_listen();
    //return 0 whether all is good
    //return 1 whether it is not turn client
    //return 2 whether the box it's ocupied 
    short catch_move(const int &, const int &);
    void manage_data(json, const int &);
    void send_update();
    bool send_message(const int &cli_sockfd, json data);
    
};

#endif