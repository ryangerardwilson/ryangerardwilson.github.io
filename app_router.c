// app_router.c
#include "app_router.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <unistd.h>

#define BUFFER_SIZE 1024

struct Route routes[10]; // Simple fixed-size array for routes
int route_count = 0;

void register_route(char *path, Handler handler) {
    if (route_count >= 10) {
        fprintf(stderr, "Maximum routes reached\n");
        return;
    }
    routes[route_count].path = path;
    routes[route_count].handler = handler;
    route_count++;
}

static int send_all(int sock, const void *buf, size_t len) {
    const char *p = buf;
    size_t remaining = len;
    while (remaining > 0) {
        ssize_t written = write(sock, p, remaining);
        if (written < 0)
            return -1;
        p += written;
        remaining -= written;
    }
    return 0;
}

void serve_file(int client_socket, char *filename, char *content_type) {
    const struct Resource *resource = NULL;
    for (int i = 0; i < embedded_resources_count; i++) {
        if (strcmp(embedded_resources[i].path, filename) == 0) {
            resource = &embedded_resources[i];
            break;
        }
    }

    if (resource == NULL) {
        const char *not_found =
            "HTTP/1.1 404 Not Found\r\nContent-Type: "
            "text/plain\r\nContent-Length: 13\r\n\r\nFile not found";
        send_all(client_socket, not_found, strlen(not_found));
        return;
    }

    char header[BUFFER_SIZE];
    int header_len = snprintf(
        header, BUFFER_SIZE,
        "HTTP/1.1 200 OK\r\nContent-Type: %s\r\nContent-Length: %zu\r\n\r\n",
        resource->content_type, resource->size);

    if (header_len < 0 || header_len >= BUFFER_SIZE) {
        const char *error =
            "HTTP/1.1 500 Internal Server Error\r\nContent-Type: "
            "text/plain\r\nContent-Length: 21\r\n\r\nInternal Server Error";
        send_all(client_socket, error, strlen(error));
        return;
    }

    if (send_all(client_socket, header, (size_t)header_len) < 0) {
        return;
    }

    if (resource->size > 0) {
        send_all(client_socket, resource->data, resource->size);
    }
}

void handle_request(int client_socket, char *buffer) {
    // Parse the request line
    char method[16], path[256], protocol[16];
    if (sscanf(buffer, "%15s %255s %15s", method, path, protocol) != 3) {
        const char *bad_request =
            "HTTP/1.1 400 Bad Request\r\nContent-Type: "
            "text/plain\r\nContent-Length: 11\r\n\r\nBad Request";
        send_all(client_socket, bad_request, strlen(bad_request));
        return;
    }

    // Check registered routes first
    for (int i = 0; i < route_count; i++) {
        if (strcmp(routes[i].path, path) == 0) {
            routes[i].handler(client_socket);
            return;
        }
    }

    // Static file serving using embedded resources
    char filename[256];

    if (strcmp(path, "/") == 0) {
        strncpy(filename, "index.html", sizeof(filename));
        filename[sizeof(filename) - 1] = '\0';
    } else {
        // Remove leading '/'
        if (path[0] == '/') {
            strncpy(filename, path + 1, sizeof(filename) - 1);
            filename[sizeof(filename) - 1] = '\0';
        } else {
            strncpy(filename, path, sizeof(filename) - 1);
            filename[sizeof(filename) - 1] = '\0';
        }
    }

    // Determine content_type based on extension (fallback if needed)
    char *ext = strrchr(filename, '.');
    if (ext != NULL) {
        if (strcmp(ext, ".js") == 0) {
            serve_file(client_socket, filename, "application/javascript");
            return;
        } else if (strcmp(ext, ".pdf") == 0) {
            serve_file(client_socket, filename, "application/pdf");
            return;
        } else if (strcmp(ext, ".html") == 0) {
            serve_file(client_socket, filename, "text/html");
            return;
        } else if (strcmp(ext, ".css") == 0) {
            serve_file(client_socket, filename, "text/css");
            return;
        }
    }

    // Default 404 if not handled
    const char *not_found =
        "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: "
        "13\r\n\r\nFile not found";
    send_all(client_socket, not_found, strlen(not_found));
}
