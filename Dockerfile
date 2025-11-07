FROM busybox:glibc
COPY app /app
WORKDIR /
EXPOSE 8080
CMD ["/app"]
