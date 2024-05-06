#ifndef __ROOM__
#define __ROOM__
#include "util.h"

class Room
{
    private:
        bool table[3][3];
        int client_o;
        int client_x;
        
    public:
        Room(int);
        ~Room(){
            //delete [] table;
        }

        void Init(int);
};

#endif