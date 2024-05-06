#ifndef __UTILS__
#define __UTILS__

#include <iostream>
#include <pthread.h>
#include <cstring>
#include <cerrno>

enum ACTION {
    AUTHENTICATION = 0,
    NEW_ROOM =1,
    CHOOSE_ROOM = 2,
    SELECT_MOVEMENT = 3,
    OUT_ROOM = 4,
    OUT_GAME = 5,
    LIST_ROOM = 6
};

/*
void error(const char *msg)
{
    std::cerr << msg << ": " << std::strerror(errno) << std::endl;
    pthread_exit(NULL);
}
*/
#endif