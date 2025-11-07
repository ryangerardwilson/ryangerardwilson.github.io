FROM busybox:glibc
COPY main /app
WORKDIR /
EXPOSE 8080
CMD ["/app"]
