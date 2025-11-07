FROM busybox:glibc
COPY main /app/main
WORKDIR /app
EXPOSE 8080
CMD ["/app/main"]
