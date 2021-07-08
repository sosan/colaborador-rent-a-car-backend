# syntax = docker/dockerfile:1.2
FROM mhart/alpine-node:14.16.1
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --only=production

# # imagen2 sin npm o yarn
FROM mhart/alpine-node:slim-14.16.1
WORKDIR /usr/src/app

COPY --from=0 /usr/src/app ./
COPY ./src ./src
COPY ./public ./public

# RUN adduser -D node
# USER node

CMD ["node", "src/index.js"]
