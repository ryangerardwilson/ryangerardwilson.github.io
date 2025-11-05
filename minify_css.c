// minify_css.c
#include "minify_css.h"
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>

void minify_css(const char *input_file, const char *output_file) {
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

        if (ch == '/' && !in_block_comment) {
            int next = fgetc(in);
            if (next == '*') {
                in_block_comment = 1;
                prev = '*';
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
