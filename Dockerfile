FROM debian:stable-slim
WORKDIR /app
COPY build/server server
COPY drizzle drizzle
COPY .env .env
CMD ["bash", "-c","./server"]