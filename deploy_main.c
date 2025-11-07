// ~/Apps/r/deploy.c
#include <getopt.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define PROJECT_DIR "$HOME/Apps/r"
#define DOCKERFILE PROJECT_DIR "/Dockerfile"
#define IMAGE_NAME "r_container"
#define IMAGE_TAG "latest"
#define TAR_FILE IMAGE_NAME ".tar"
#define REMOTE_USER "rgw"
#define REMOTE_HOST "icdattcwsm"
#define REMOTE_DIR "/tmp"
#define SERVER_PORT 8080

// Compile with: clang deploy_main.c -o deploy
int main(int argc, char *argv[]) {
    int local_run = 0;
    int deploy = 0;
    int opt;

    while ((opt = getopt(argc, argv, "lp")) != -1) {
        switch (opt) {
        case 'l':
            local_run = 1;
            break;
        case 'p':
            deploy = 1;
            break;
        default:
            fprintf(stderr, "Invalid option, you git. Only -l or -p.\n");
            return 1;
        }
    }

    if (local_run && deploy) {
        fprintf(stderr, "Can't do both -l and -p at once, genius. Pick one.\n");
        return 1;
    } else if (!local_run && !deploy) {
        fprintf(stderr,
                "Usage: %s [-l] for local or [-p] for production. Make up your "
                "mind.\n",
                argv[0]);
        return 1;
    }

    // Parse the port from server.c, because apparently you can't keep hardcoded
    // crap in sync
    char *home = getenv("HOME");
    if (home == NULL) {
        fprintf(stderr, "Can't find $HOME, you moron. What kind of Omarchy "
                        "setup is this?\n");
        return 1;
    }

    int port = SERVER_PORT;
    // Build the image regardless
    char build_cmd[256];
    snprintf(build_cmd, sizeof(build_cmd), "docker build -f %s -t %s:%s %s",
             DOCKERFILE, IMAGE_NAME, IMAGE_TAG, PROJECT_DIR);
    if (system(build_cmd) != 0) {
        fprintf(stderr, "Docker build failed. Fix your crap.\n");
        return 1;
    }

    if (local_run) {
        system("docker stop r_container || true");
        system("docker rm r_container || true");
        char run_cmd[256];
        snprintf(run_cmd, sizeof(run_cmd),
                 "docker run -d --name r_container -p %d:%d %s:%s", port, port,
                 IMAGE_NAME, IMAGE_TAG);
        if (system(run_cmd) != 0) {
            fprintf(stderr, "Local run failed. Logs:"
                            "'docker logs r_container'.\n ");
            return 1;
        }
        printf("Local container up. Hit http://localhost:%d. Logs: 'docker "
               "logs r_container'.\n",
               port);
    }

    if (deploy) {
        char save_cmd[256];
        snprintf(save_cmd, sizeof(save_cmd), "docker save -o %s %s:%s",
                 TAR_FILE, IMAGE_NAME, IMAGE_TAG);
        if (system(save_cmd) != 0) {
            fprintf(stderr, "Save to tar failed.\n");
            return 1;
        }

        char scp_cmd[256];
        snprintf(scp_cmd, sizeof(scp_cmd), "scp %s %s@%s:%s/%s", TAR_FILE,
                 REMOTE_USER, REMOTE_HOST, REMOTE_DIR, TAR_FILE);
        if (system(scp_cmd) != 0) {
            fprintf(stderr, "SCP failed.\n");
            return 1;
        }

        char ssh_cmd[512];
        snprintf(ssh_cmd, sizeof(ssh_cmd),
                 "ssh %s@%s 'docker load -i %s/%s && "
                 "docker stop r_container 2>/dev/null || true && "
                 "docker rm r_container 2>/dev/null || true && "
                 "docker run -d --name r_container -p %d:%d %s:%s && "
                 "rm %s/%s'",
                 REMOTE_USER, REMOTE_HOST, REMOTE_DIR, TAR_FILE, port, port,
                 IMAGE_NAME, IMAGE_TAG, REMOTE_DIR, TAR_FILE);
        if (system(ssh_cmd) != 0) {
            fprintf(stderr, "SSH deploy failed.\n");
            return 1;
        }

        if (system("python deploy_util_cloudflare_cache_purge.py") != 0) {
            fprintf(stderr, "Cloudflare cache purge failed.\n");
        }

        remove(TAR_FILE);
        printf("Deployed to icdattcwsm. Check logs: 'ssh "
               "icdattcwsm docker logs r_container'. Now buzz off and let me "
               "kernel "
               "in peace.\n");
    }

    return 0;
}
