// build.c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int result = system("clang main.c orchestrator.c web_server.c -o main");
    if (result == 0) {
        printf("Build successful.\n");
    } else {
        printf("Build failed.\n");
    }
    return result;
}
