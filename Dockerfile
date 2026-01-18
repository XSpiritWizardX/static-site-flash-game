FROM alpine:3.19
WORKDIR /app
COPY . .
CMD ["sh", "-c", "echo "Backend image placeholder" && sleep 3600"]
