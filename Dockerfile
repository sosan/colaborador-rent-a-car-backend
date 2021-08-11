# syntax = docker/dockerfile:1.2
FROM mhart/alpine-node:16.2.0 as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

COPY ./src ./src


RUN npm install -g pkg && \
    pkg ./src/index.js --targets node16-linux-x64 --compress GZip --output /usr/src/app/backend -c ./package.json

FROM frolvlad/alpine-glibc:latest
RUN apk update && \
    apk add --no-cache libstdc++ libgcc ca-certificates && \
    rm -rf /var/cache/apk/* && \
    rm -rf /var/lib/apt/lists/* 

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/backend .

USER 1001
CMD /usr/src/app/backend
