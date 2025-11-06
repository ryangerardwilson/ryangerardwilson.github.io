// build.c
#include "build_resource_embedder.h"
#include <stdio.h>
#include <stdlib.h>

/* Compile with:
clang build_main.c build_minify_css.c build_minify_js.c \
build_resource_embedder.c -o build
*/

int main() {
    int embed_result = embed_resources();
    if (embed_result != 0) {
        return embed_result;
    }

    int result = system("clang main.c orchestrator.c server.c router.c "
                        "route_register.c embedded_resources.c -o main");
    if (result == 0) {
        printf("Build successful.\n");
    } else {
        printf("Build failed.\n");
    }
    return result;
}
