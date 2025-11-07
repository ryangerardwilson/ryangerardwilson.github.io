// app_router.h
#ifndef ROUTER_H
#define ROUTER_H

#include <stddef.h>

typedef void (*Handler)(int client_socket);

struct Route {
    char *path;
    Handler handler;
};

struct Resource {
    const char *path;
    const unsigned char *data;
    size_t size;
    const char *content_type;
};

extern struct Route routes[10];
extern int route_count;

extern const struct Resource embedded_resources[];
extern const int embedded_resources_count;

void register_route(char *path, Handler handler);
void serve_file(int client_socket, char *filename, char *content_type);
void handle_request(int client_socket, char *buffer);

#endif
