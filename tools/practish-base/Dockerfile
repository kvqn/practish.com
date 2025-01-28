FROM alpine:3.21 AS build

RUN apk add go

COPY container-io.go container-io.go

RUN go build -o container-io container-io.go

FROM alpine:3.21 AS base

EXPOSE 8080

COPY --from=build /container-io /container-io
