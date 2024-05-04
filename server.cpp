#include "server.h"


Server::Server(int port): list_client(), mtx_client()
{
	
    struct sockaddr_in serv_addr;

    lis_sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (lis_sockfd < 0){}
        //error("ERROR opening listener socket.");

    //memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = INADDR_ANY;
    serv_addr.sin_port = htons(port);

    if (bind(lis_sockfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0){}
        //error("ERROR binding listener socket.");

}

void Server::start()
{
    
	while (true)
	{
		if(list_client.size() < MAX_CONNECTIONS)
		{
			set_up_connection();
		}
	}
	
}

bool Server::send_message(int cli_sockfd, std::string msg)
{
	int n = write(cli_sockfd, msg.c_str(), strlen(msg.c_str()));
   	if (n < 0)
		return false;
	return true;
}


void Server::set_up_room(int listening_sockeck_fd, int *client_socket_fd)
{

}

void Server::receve(int cli_sockfd)
{
    printf("comienza receve\n");
    while (true)
    {
        char msg[1024] = {0};
        int n = read(cli_sockfd, msg, 1024);

        if (n < 0 || n == 0)
            return;
            //return -1;
        printf("[DEBUG] Received: %s\n", msg);
        /* code */
    }

    printf("termina receve\n");
    
}

//conexion individual 
bool Server::set_up_connection()
{
    socklen_t clilen;
    struct sockaddr_in serv_addr, cli_addr;

    listen(lis_sockfd, MAX_CONNECTIONS);
    clilen = sizeof(cli_addr);

    int client_id = accept(lis_sockfd, (struct sockaddr *)&cli_addr, &clilen);
    if (client_id < 0){
        std::cerr << "ERROR accepting a connection from a client." << ": " << std::strerror(errno) << std::endl;
        return false;
    }

    std::cout << "cliente: " << client_id << std::endl;

	list_client.push_back(client_id);
	send_message(client_id, "hola");  

    receve(client_id);
    
    return true;
}



Server::~Server()
{

}
