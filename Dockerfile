FROM ubuntu:24.04
COPY main /app/main
WORKDIR /app
EXPOSE 8080
CMD ["/app/main"]
