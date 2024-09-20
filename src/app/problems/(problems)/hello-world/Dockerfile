FROM alpine:3.20

WORKDIR /app

COPY expected-output.txt .
COPY docker-entrypoint.sh .

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
# ENTRYPOINT ["cat", "docker-entrypoint.sh"]

