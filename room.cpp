#include "room.h"

Room::Room(const int &cl_o, const std::string &_key_room, closeRoomServer f) : client_o(cl_o), client_x(-1), num_fds(2), key_room(_key_room)
{
    close_room = f;
    memset(table, -1, sizeof(table));
    available = true;
    _restart = false;
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

    j["table"] = {{table[0][0], table[0][1], table[0][2]},
                    {table[1][0], table[1][1], table[1][2]}, 
                    {table[2][0], table[2][1], table[2][2]}};
    turn = false;
    j["turn"] = turn;
    j["rol"] = 0;
    send_message(client_o, j);
    j["rol"] = 1;
    send_message(client_x, j);
    listening = true;
    //send_update();
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
    if(move == 12)
    {
        return 4;
    }

    if((turn && client_x != fd) || (!turn && client_o != fd))
        return 1;
 

    if(table[move / 3][move % 3] != -1)
        return 2;

    table[move / 3][move % 3] = turn;

    if(check_full())
        return 4;

    if(check_win(move))
        return 3;

    turn = !turn;
    
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

    close();

    
}

Room::~Room()
{
    if (hilo->joinable())
    {
        //close(fds[0].fd);
        //close(fds[1].fd);
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
            int status = catch_move(move, fd);
            send_update(status);
            break;
        }
        case ACTION_GAME::CLOSE:
        {
            listening = false;
            break;
        }
        case ACTION_GAME::RESTART:
        {
            restart(fd);
            break;
        }

        default:
        {

            break;
        }
        }
    }
}

void Room::send_update(int status)
{
    json res;
    res["action"] = ACTION_GAME::UPDATE;
    res["table"] = {{table[0][0], table[0][1], table[0][2]},
                    {table[1][0], table[1][1], table[1][2]}, 
                    {table[2][0], table[2][1], table[2][2]}};
    res["turn"] = turn;
    res["status"] = status;

    if(status == 3)
    {
        res["action"] = ACTION_GAME::WIN;
    }

    send_message(client_o, res);
    send_message(client_x, res);
}

bool Room::check_win(const int & move)
{
    int row = move / 3;
    int col = move % 3;

    if(table[row][0] != -1 && table[row][0] == table[row][1] && table[row][1] == table[row][2])
        return true;
    if(table[0][col] != -1 && table[0][col] == table[1][col] && table[1][col] == table[2][col])
        return true;
    if(table[1][1] != -1 && ( (table[1][1] == table[0][0] && table[1][1] == table[2][2]) || (table[1][1] == table[0][2] && table[1][1] == table[2][0])))
        return true;

    return false;
}


bool Room::check_full()
{
    for(int i = 0 ; i< 3 ; i++){
        
        if(table[i][0] == -1 || table[i][1] == -1  || table[i][2] == -1 )
        {
            return false;
        }
    }

    return true;
}


bool Room::send_message(const int &cli_sockfd, json data)
{
    std::string msg = data.dump();
    int n = write(cli_sockfd, msg.c_str(), strlen(msg.c_str()));
    if (n < 0)
        return false;
    return true;
}

void Room::restart(const int &fd)
{
    if(_restart)
    {
        memset(table, -1, sizeof(table));
        turn = false;
        _restart = false;
        send_update();
    }else
    {
        _restart = true;
        json js;
        js["action"] = ACTION_GAME::RESTART;
        // status 0 esperando a que el otro usuario este de acuerdo en reiniciar la partida
        js["status"] = 0;
        send_message(fd, js);
        //otro usuario en espera de respuesta
         js["status"] = 1;
        if(fd == client_o)
        {
            send_message(client_x, js);
        }else
        {
            send_message(client_o, js);
        }
    }

}

void Room::close()
{
    close_room(client_o, client_x, key_room);
}