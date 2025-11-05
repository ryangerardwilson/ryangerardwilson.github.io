// router.h
#ifndef ROUTER_H
#define ROUTER_H

typedef void (*Handler)(int client_socket);

struct Route {
    char *path;
    Handler handler;
};

extern struct Route routes[10];
extern int route_count;

void register_route(char *path, Handler handler);
void serve_file(int client_socket, char *filename, char *content_type);
void handle_request(int client_socket, char *buffer);

#endif
