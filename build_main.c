// build.c
#include "minify_css.h"
#include "minify_js.h"
#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Compile with: clang build_main.c minify_css.c minify_js.c -o build

int main() {
    DIR *dir = opendir(".");
    if (dir == NULL) {
        perror("opendir failed");
        return 1;
    }

    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (entry->d_type != DT_REG)
            continue;

        char *filename = entry->d_name;
        size_t len = strlen(filename);

        if (len > 3 && strcmp(filename + len - 3, ".js") == 0) {
            if (strstr(filename, ".min.js") != NULL)
                continue;

            char output[256];
            snprintf(output, sizeof(output), "%.*s.min.js", (int)(len - 3),
                     filename);
            minify_js(filename, output);
        } else if (len > 4 && strcmp(filename + len - 4, ".css") == 0) {
            if (strstr(filename, ".min.css") != NULL)
                continue;

            char output[256];
            snprintf(output, sizeof(output), "%.*s.min.css", (int)(len - 4),
                     filename);
            minify_css(filename, output);
        }
    }

    closedir(dir);

    int result = system("clang main.c orchestrator.c server.c router.c "
                        "route_register.c -o main");
    if (result == 0) {
        printf("Build successful.\n");
    } else {
        printf("Build failed.\n");
    }
    return result;
}
