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
    bool table[3][3];
    int client_o;
    int client_x;
    int num_fds;
    struct pollfd fds[2];

public:
    bool available;
    Room(const int &);
    ~Room()
    {
        // delete [] table;
    }
    json read_data(int, int &);
    void Init(const int &, struct pollfd *, int &);
    void set_listen();
};

#endif