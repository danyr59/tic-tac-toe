#include "room.h"


Room::Room(const int& cl_o) : client_o(cl_o), client_x(-1), num_fds(2)
{
    memset(table, false, sizeof(table));
    available = true;
}

void Room::Init(const int& cl_x, struct pollfd * _fds, int & fds_tam)
{
    
    client_x = cl_x;
    available = false;
    for(int i = 0; i < fds_tam; ++i)
    {
        if(_fds[i].fd == client_o || _fds[i].fd == client_x )
        {
            _fds[i].fd = -1;
        }
    }

    fds[0].fd = client_o;
    fds[1].fd = client_x;

    set_listen();
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

void Room::set_listen(){
    while (true)
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
                    //manage_data(data, fds[i].fd);
                }
                else
                {
                    // El cliente se desconectó o hubo un error
                    //close(fds[i].fd);
                    //fds[i].fd = -1;
                }
            }
        }
    }
}