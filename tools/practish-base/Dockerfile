FROM alpine:3.21 AS build

RUN apk add go

COPY container-io.go container-io.go
COPY submission-runner submission-runner

RUN go build -o container-io container-io/main.go
RUN go build -o submission-runner submission-runner/main.go

FROM alpine:3.21 AS base

RUN apk add zip

EXPOSE 8080

COPY --from=build /container-io /container-io
COPY --from=build /submission-runner /submission-runner

