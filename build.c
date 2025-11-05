// build.c
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Compile with: clang build.c -o build

void minify_file(const char *input_file, const char *output_file, int is_css) {
    FILE *in = fopen(input_file, "r");
    if (in == NULL) {
        perror("Failed to open input file");
        return;
    }
    FILE *out = fopen(output_file, "w");
    if (out == NULL) {
        perror("Failed to open output file");
        fclose(in);
        return;
    }

    int ch;
    int prev = 0;
    int in_block_comment = 0;
    int in_line_comment = 0;

    while ((ch = fgetc(in)) != EOF) {
        if (in_block_comment) {
            if (prev == '*' && ch == '/') {
                in_block_comment = 0;
                prev = 0;
                continue;
            }
            prev = ch;
            continue;
        }

        if (in_line_comment) {
            if (ch == '\n') {
                in_line_comment = 0;
                prev = 0;
                continue;
            }
            prev = ch;
            continue;
        }

        if (ch == '/' && !in_block_comment && !in_line_comment) {
            int next = fgetc(in);
            if (next == '*') {
                in_block_comment = 1;
                prev = '*';
                continue;
            } else if (next == '/' && !is_css) {
                in_line_comment = 1;
                prev = '/';
                continue;
            } else {
                ungetc(next, in);
            }
        }

        // Handle whitespace
        if (isspace(ch)) {
            if (prev == 0 || isspace(prev)) {
                continue; // Skip leading or multiple spaces
            }
            ch = ' '; // Normalize to single space
        }

        fputc(ch, out);
        prev = ch;
    }

    fclose(in);
    fclose(out);
}

int main() {
    minify_file("main.css", "main.min.css", 1);
    minify_file("main.js", "main.min.js", 0);

    int result = system("clang main.c orchestrator.c server.c router.c "
                        "route_register.c -o main");
    if (result == 0) {
        printf("Build successful.\n");
    } else {
        printf("Build failed.\n");
    }
    return result;
}
