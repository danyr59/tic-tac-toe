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

//#include "server.h"
//class Server;

using json = nlohmann::json;

using closeRoomServer = std::function<void(const int &, const int &, std::string)>;

class Room
{
private:

    // libre -> -1
    // O -> 0 
    // x -> 1
    short table[3][3];
    closeRoomServer close_room;
    //false client o
    //true client x
    bool turn, listening, _restart;
    std::string key_room;
    int client_o;
    int client_x;
    int num_fds;
    std::thread * hilo;
    struct pollfd fds[2];

public:
    bool available;
    Room(const int &,const std::string &, closeRoomServer);
    ~Room();
    json read_data(int, int &);
    void Init(const int &, struct pollfd *, int &);
    void set_listen();
    //return 0 si todo esta bien
    //return 1 si no es el turno del cliente
    //return 2 si la posicion esta ocupada
    //return 3 si el jugador a ganado 
    short catch_move(const int &, const int &);
    void manage_data(json, const int &);
    void send_update(int status = 0);
    bool send_message(const int &cli_sockfd, json data);
    bool check_win(const int &);
    void restart(const int &);

    //return true si esta full el tablero
    //return false si hay posiciones disponibles por ocupar
    bool check_full();

    void close();
    
};

#endif