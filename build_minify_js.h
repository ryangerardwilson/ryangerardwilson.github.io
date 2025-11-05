// build_minify_js.h
#ifndef BUILD_MINIFY_JS_H
#define BUILD_MINIFY_JS_H

#include <stddef.h>

void minify_js(const char *input_file, const char *output_file);
unsigned char *minify_js_buffer(const unsigned char *input_buf, size_t input_size, size_t *output_size);

#endif
