# syntax = docker/dockerfile:1.2
FROM mhart/alpine-node:16.2.0 as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

COPY ./src ./src
COPY ./public ./public

RUN npm install -g pkg && \
    pkg ./src/index.js --targets node16-linux-x64 --compress GZip --output /usr/src/app/backoffice -c ./package.json

FROM frolvlad/alpine-glibc
RUN apk update && \
    apk add --no-cache libstdc++ libgcc ca-certificates && \
    rm -rf /var/cache/apk/* && \
    adduser -D alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/backoffice .
USER alpine
CMD /usr/src/app/backoffice



# # imagen2 sin npm o yarn
# FROM mhart/alpine-node:slim-14.16.1
# WORKDIR /usr/src/app

# COPY --from=0 /usr/src/app ./
# COPY ./src ./src
# COPY ./public ./public

# # RUN adduser -D node
# # USER node

# CMD ["node", "src/index.js"]

