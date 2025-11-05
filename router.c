// router.c
#include "router.h"
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
    FILE *file = fopen(filename, "rb");
    if (file == NULL) {
        const char *not_found =
            "HTTP/1.1 404 Not Found\r\nContent-Type: "
            "text/plain\r\nContent-Length: 13\r\n\r\nFile not found";
        send_all(client_socket, not_found, strlen(not_found));
        return;
    }

    if (fseek(file, 0, SEEK_END) != 0) {
        fclose(file);
        const char *error =
            "HTTP/1.1 500 Internal Server Error\r\nContent-Type: "
            "text/plain\r\nContent-Length: 21\r\n\r\nInternal Server Error";
        send_all(client_socket, error, strlen(error));
        return;
    }

    long file_size = ftell(file);
    fseek(file, 0, SEEK_SET);

    char *content = NULL;
    if (file_size > 0) {
        content = malloc((size_t)file_size);
        if (content == NULL) {
            fclose(file);
            const char *error =
                "HTTP/1.1 500 Internal Server Error\r\nContent-Type: "
                "text/plain\r\nContent-Length: 21\r\n\r\nInternal Server Error";
            send_all(client_socket, error, strlen(error));
            return;
        }

        size_t read = fread(content, 1, (size_t)file_size, file);
        if ((long)read != file_size) {
            free(content);
            fclose(file);
            const char *error =
                "HTTP/1.1 500 Internal Server Error\r\nContent-Type: "
                "text/plain\r\nContent-Length: 21\r\n\r\nInternal Server Error";
            send_all(client_socket, error, strlen(error));
            return;
        }
    }

    fclose(file);

    char header[BUFFER_SIZE];
    int header_len = snprintf(
        header, BUFFER_SIZE,
        "HTTP/1.1 200 OK\r\nContent-Type: %s\r\nContent-Length: %ld\r\n\r\n",
        content_type, file_size);

    if (header_len < 0 || header_len >= BUFFER_SIZE) {
        free(content);
        const char *error =
            "HTTP/1.1 500 Internal Server Error\r\nContent-Type: "
            "text/plain\r\nContent-Length: 21\r\n\r\nInternal Server Error";
        send_all(client_socket, error, strlen(error));
        return;
    }

    if (send_all(client_socket, header, (size_t)header_len) < 0) {
        free(content);
        return;
    }

    if (file_size > 0) {
        send_all(client_socket, content, (size_t)file_size);
        free(content);
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

    // Static file serving for .js, .pdf, .html, .css and index for "/"
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
