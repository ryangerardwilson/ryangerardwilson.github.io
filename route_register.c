// route_register.c
#include "router.h"

void handle_root(int client_socket) {
    serve_file(client_socket, "index.html", "text/html");
}

void register_routes() {
    // Business logic: register routes here
    // Example: register the root path to serve index.html
    register_route("/", handle_root);

    // Add more routes as needed for business logic
    // For example:
    // register_route("/api/data", handle_api_data);
}
