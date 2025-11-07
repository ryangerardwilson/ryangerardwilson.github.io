// ~/Apps/r/build_resource_embedder.c
#include "build_resource_embedder.h"
#include "build_minify_css.h"
#include "build_minify_js.h"
#include <ctype.h>
#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_FILES 100
#define MAX_FILENAME 256

struct FileToEmbed {
    char filename[MAX_FILENAME];
    char sanitized[MAX_FILENAME];
    char content_type[32];
};

int is_embeddable(const char *filename) {
    size_t len = strlen(filename);
    if (len > 5 && strcmp(filename + len - 5, ".html") == 0)
        return 1;
    if (len > 4 && strcmp(filename + len - 4, ".css") == 0)
        return 1;
    if (len > 3 && strcmp(filename + len - 3, ".js") == 0)
        return 1;
    if (len > 4 && strcmp(filename + len - 4, ".pdf") == 0)
        return 1;
    if (len > 3 && strcmp(filename + len - 3, ".md") == 0)
        return 1;
    return 0;
}

const char *get_content_type(const char *filename) {
    if (strstr(filename, ".html"))
        return "text/html";
    if (strstr(filename, ".css"))
        return "text/css";
    if (strstr(filename, ".js"))
        return "application/javascript";
    if (strstr(filename, ".pdf"))
        return "application/pdf";
    if (strstr(filename, ".md"))
        return "text/markdown";
    return "application/octet-stream";
}

void sanitize_filename(const char *filename, char *sanitized) {
    strcpy(sanitized, filename);
    for (char *p = sanitized; *p; p++) {
        if (*p == '.' || *p == '-')
            *p = '_';
    }
}

static int read_file_to_buffer(const char *filename, unsigned char **buf,
                               size_t *size) {
    FILE *f = fopen(filename, "rb");
    if (f == NULL) {
        perror("Failed to open file for reading");
        return 1;
    }
    fseek(f, 0, SEEK_END);
    *size = (size_t)ftell(f);
    fseek(f, 0, SEEK_SET);
    *buf = malloc(*size);
    if (*buf == NULL || fread(*buf, 1, *size, f) != *size) {
        perror("Failed to read file");
        free(*buf);
        *buf = NULL;
        fclose(f);
        return 1;
    }
    fclose(f);
    return 0;
}

int resume_and_my_story_pdf_generation_handler() {
    int conv1 = system("python build_util_md2pdf.py my_story.md my_story.pdf");
    int conv2 = system("python build_util_md2pdf.py resume.md resume.pdf");
    if (conv1 != 0 || conv2 != 0) {
        fprintf(stderr, "Failed to convert md to pdf\n");
        return 1;
    }
    return 0;
}

int embed_resources() {
    if (resume_and_my_story_pdf_generation_handler() != 0) {
        return 1;
    }

    // Collect files to embed
    struct FileToEmbed files[MAX_FILES];
    int num_files = 0;

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
        if (is_embeddable(filename)) {
            if (strcmp(filename, "my_story.md") == 0 ||
                strcmp(filename, "resume.md") == 0) {
                continue;
            }
            if (num_files >= MAX_FILES) {
                fprintf(stderr, "Too many files to embed\n");
                closedir(dir);
                return 1;
            }
            strncpy(files[num_files].filename, filename, MAX_FILENAME);
            sanitize_filename(filename, files[num_files].sanitized);
            strcpy(files[num_files].content_type, get_content_type(filename));
            num_files++;
        }
    }

    closedir(dir);

    // Generate app_embedded_resources.c
    FILE *res = fopen("app_embedded_resources.c", "w");
    if (res == NULL) {
        perror("Failed to create app_embedded_resources.c");
        return 1;
    }

    fprintf(res, "#include <stddef.h>\n");
    fprintf(res, "#include \"app_router.h\"\n\n");

    for (int i = 0; i < num_files; i++) {
        char *filename = files[i].filename;
        char *sanitized = files[i].sanitized;

        unsigned char *raw_content = NULL;
        size_t raw_size;
        if (read_file_to_buffer(filename, &raw_content, &raw_size) != 0) {
            fclose(res);
            return 1;
        }

        unsigned char *buf = raw_content;
        size_t size = raw_size;
        size_t len = strlen(filename);
        if (len > 4 && strcmp(filename + len - 4, ".css") == 0) {
            unsigned char *minified =
                minify_css_buffer(raw_content, raw_size, &size);
            free(raw_content);
            if (minified == NULL) {
                fclose(res);
                return 1;
            }
            buf = minified;
        } else if (len > 3 && strcmp(filename + len - 3, ".js") == 0) {
            unsigned char *minified =
                minify_js_buffer(raw_content, raw_size, &size);
            free(raw_content);
            if (minified == NULL) {
                fclose(res);
                return 1;
            }
            buf = minified;
        }

        fprintf(res, "const unsigned char resource_%s[] = {\n", sanitized);
        for (size_t j = 0; j < size; j++) {
            fprintf(res, "0x%02x,", buf[j]);
            if (j % 16 == 15)
                fprintf(res, "\n");
        }
        fprintf(res, "\n};\n");
        fprintf(res, "const size_t resource_%s_size = %zu;\n\n", sanitized,
                size);

        free(buf);
    }

    fprintf(res, "const struct Resource embedded_resources[] = {\n");
    for (int i = 0; i < num_files; i++) {
        fprintf(res, "    {\"%s\", resource_%s, resource_%s_size, \"%s\"},\n",
                files[i].filename, files[i].sanitized, files[i].sanitized,
                files[i].content_type);
    }
    fprintf(res, "};\n");
    fprintf(res, "const int embedded_resources_count = %d;\n", num_files);

    fclose(res);

    return 0;
}
