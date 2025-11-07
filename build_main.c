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

    int result =
        system("clang app_main.c app_orchestrator.c app_server.c app_router.c "
               "app_route_register.c app_embedded_resources.c -o app");
    if (result == 0) {
        printf("Build successful.\n");
    } else {
        printf("Build failed.\n");
    }
    return result;
}
