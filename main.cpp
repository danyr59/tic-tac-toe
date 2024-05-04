#include "server.h"
#define PORT 5000

int main()
{

    Server serr(PORT);
    serr.start();

	return 0;
}	