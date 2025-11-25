// app_server.c
#include "app_route_register.h"
#include "app_router.h"
#include <errno.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define PORT 8080
#define BUFFER_SIZE 1024
#define PENDING_CONNECTIONS_QUEUE_LIMIT 128

static void sigchld_handler(int sig) {
    (void)sig;
    /* Reap all dead children without blocking */
    while (waitpid(-1, NULL, WNOHANG) > 0)
        ;
}

void start_server() {
    int server_fd, new_socket;
    struct sockaddr_in address;
    int opt = 1;
    socklen_t addrlen = sizeof(address);
    char buffer[BUFFER_SIZE];

    // Create socket
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    // Correct setsockopt use — do options separately
    if (setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) <
        0) {
        perror("setsockopt SO_REUSEADDR");
        close(server_fd);
        exit(EXIT_FAILURE);
    }
#ifdef SO_REUSEPORT
    if (setsockopt(server_fd, SOL_SOCKET, SO_REUSEPORT, &opt, sizeof(opt)) <
        0) {
        // Not fatal on some systems; print and continue
        perror("setsockopt SO_REUSEPORT");
    }
#endif

    memset(&address, 0, sizeof(address));
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    // Bind
    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("bind failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    // Listen
    if (listen(server_fd, PENDING_CONNECTIONS_QUEUE_LIMIT) < 0) {
        perror("listen");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    // Install SIGCHLD handler to reap children and prevent zombies
    struct sigaction sa;
    sa.sa_handler = sigchld_handler;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = SA_RESTART; // try to restart syscalls interrupted by signals
    if (sigaction(SIGCHLD, &sa, NULL) == -1) {
        perror("sigaction");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    printf("Server listening on port %d (pid=%d)\n", PORT, getpid());

    // Register routes (business logic)
    register_routes();

    for (;;) {
        new_socket = accept(server_fd, (struct sockaddr *)&address, &addrlen);
        if (new_socket < 0) {
            if (errno == EINTR) {
                // Interrupted by signal (likely SIGCHLD). retry accept.
                continue;
            } else {
                perror("accept");
                // continue accepting other connections
                continue;
            }
        }

        pid_t pid = fork();
        if (pid < 0) {
            // Fork failed; close socket and continue
            perror("fork");
            close(new_socket);
            continue;
        } else if (pid == 0) {
            // Child process
            close(server_fd); // child doesn't need listener

            ssize_t n = read(new_socket, buffer, BUFFER_SIZE - 1);
            if (n < 0) {
                perror("read");
                // proceed to handle_request anyway if appropriate, or close
                buffer[0] = '\0';
            } else {
                // Null-terminate safely for string-handling
                if (n >= BUFFER_SIZE - 1) {
                    buffer[BUFFER_SIZE - 1] = '\0';
                } else {
                    buffer[n] = '\0';
                }
            }

            handle_request(new_socket, buffer);

            close(new_socket);
            _exit(0); // use _exit in children after fork
        } else {
            // Parent
            close(new_socket);
            // parent does not wait here; SIGCHLD handler will reap children
        }
    }

    close(server_fd);
}
