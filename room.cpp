#include "room.h"


Room::Room(const int& cl_o) : client_o(cl_o), client_x(-1)
{
    memset(table, false, sizeof(table));
}

void Room::Init(int cl_x)
{
    client_x = cl_x;
}