FROM oven/bun:alpine


RUN apk add docker

WORKDIR /app

EXPOSE 3000
ENTRYPOINT ["bun", "next:dev"]
