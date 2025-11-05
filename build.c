// build.c
#include <stdio.h>
#include <stdlib.h>

// Compile with: clang build.c -o build
int main() {
    int result = system("clang main.c orchestrator.c server.c router.c "
                        "route_register.c -o main");
    if (result == 0) {
        printf("Build successful.\n");
    } else {
        printf("Build failed.\n");
    }
    return result;
}
