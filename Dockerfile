# syntax = docker/dockerfile:1.2
FROM mhart/alpine-node:16.2.0 as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

COPY ./src ./src
COPY ./public ./public

RUN npm install -g pkg && \
    pkg ./src/index.js --targets node16-linux-x64 --compress GZip --output /usr/src/app/backoffice -c ./package.json



FROM busybox AS util_builder

FROM gcr.io/distroless/cc:nonroot

USER 1001
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/backoffice .
COPY --from=util_builder /bin/wget /usr/bin/wget

CMD [ "/usr/src/app/backoffice" ]


# FROM frolvlad/alpine-glibc
# RUN apk update && \
#     apk add --no-cache libstdc++ libgcc ca-certificates && \
#     rm -rf /var/cache/apk/* && \
#     adduser -D alpine
# WORKDIR /usr/src/app
# COPY --from=builder /usr/src/app/backoffice .
# USER alpine
# CMD /usr/src/app/backoffice

