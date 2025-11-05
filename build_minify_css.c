// build_minify_css.c
#include "build_minify_css.h"
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

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

unsigned char *minify_css_buffer(const unsigned char *input_buf,
                                 size_t input_size, size_t *output_size) {
    unsigned char *out_buf = malloc(input_size + 1); // +1 for safety
    if (out_buf == NULL) {
        perror("malloc failed");
        return NULL;
    }

    size_t idx = 0;
    int prev = 0;
    int in_block_comment = 0;
    size_t i = 0;

    while (i < input_size) {
        int ch = input_buf[i];

        if (in_block_comment) {
            if (prev == '*' && ch == '/') {
                in_block_comment = 0;
                prev = 0;
                i++;
                continue;
            }
            prev = ch;
            i++;
            continue;
        }

        if (ch == '/' && !in_block_comment) {
            i++;
            if (i < input_size && input_buf[i] == '*') {
                in_block_comment = 1;
                prev = '*';
                i++;
                continue;
            } else {
                // Put back the /
                ch = '/';
            }
        } else {
            i++;
        }

        // Handle whitespace
        if (isspace(ch)) {
            if (prev == 0 || isspace(prev)) {
                continue;
            }
            ch = ' ';
        }

        out_buf[idx++] = ch;
        prev = ch;
    }

    *output_size = idx;
    return out_buf;
}
