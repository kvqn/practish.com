FROM alpine:3.21 AS build

RUN apk add go

COPY container-manager.go container-manager.go

RUN go build -o container-manager container-manager.go

FROM alpine:3.21 AS base

EXPOSE 4000

COPY --from=build /container-manager /container-manager

ENTRYPOINT ["/container-manager"]

