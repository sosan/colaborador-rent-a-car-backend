# syntax = docker/dockerfile:1.2
FROM mhart/alpine-node:16.4.2 as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

COPY ./src ./src


RUN npm install -g pkg && \
    pkg ./src/index.js --targets node16-linux-x64 --compress GZip --output /usr/src/app/backend -c ./package.json

# FROM frolvlad/alpine-glibc:latest
# RUN apk update && \
#     apk add --no-cache libstdc++ libgcc ca-certificates && \
#     rm -rf /var/cache/apk/* && \
#     rm -rf /var/lib/apt/lists/* 

# WORKDIR /usr/src/app
# COPY --from=builder /usr/src/app/backend .

# USER 1001

FROM busybox AS util_builder

FROM gcr.io/distroless/cc:nonroot

USER 1001
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/backend .
COPY --from=util_builder /bin/wget /usr/bin/wget

CMD [ "/usr/src/app/backend" ]

HEALTHCHECK --interval=60s \
    --start-period=5s \
    --timeout=10s \
    --retries=3 \
    CMD ["/usr/bin/wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/islive_0_QJFs_a_IiW_mFtZS2_f_A_BQ_NTib_Y3O6Ik_D0WNH9I"]
