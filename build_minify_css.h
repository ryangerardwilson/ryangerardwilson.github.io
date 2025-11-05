// build_minify_css.h
#ifndef BUILD_MINIFY_CSS_H
#define BUILD_MINIFY_CSS_H

#include <stddef.h>

void minify_css(const char *input_file, const char *output_file);
unsigned char *minify_css_buffer(const unsigned char *input_buf, size_t input_size, size_t *output_size);

#endif
