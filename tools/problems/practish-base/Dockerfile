FROM alpine:3.21 AS build

RUN apk add go

COPY container-io /src/container-io
COPY submission-runner /src/submission-runner

RUN go build -o /bin/container-io /src/container-io/main.go
RUN go build -o /bin/submission-runner /src/submission-runner/main.go

FROM alpine:3.21 AS base

RUN apk add zip

EXPOSE 8080

COPY --from=build /bin/container-io /container-io
COPY --from=build /bin/submission-runner /submission-runner

