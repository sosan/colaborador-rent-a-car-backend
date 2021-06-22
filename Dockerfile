# syntax=docker/dockerfile:1.2
FROM mhart/alpine-node:16.2.0
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --only=production

# # imagen2 sin npm o yarn
FROM mhart/alpine-node:slim-16.2.0
WORKDIR /usr/src/app

COPY --from=0 /usr/src/app ./
COPY ./src ./src

RUN --mount=type=secret,id=PORT_BACKEND cat /run/secrets/PORT_BACKEND
RUN --mount=type=secret,id=PORT_FRONTEND cat /run/secrets/PORT_FRONTEND
RUN --mount=type=secret,id=REDISDB_PORT cat /run/secrets/REDISDB_PORT
RUN --mount=type=secret,id=REDISDB_HOST cat /run/secrets/REDISDB_HOST
RUN --mount=type=secret,id=REDISDB_PASSWORD cat /run/secrets/REDISDB_PASSWORD
RUN --mount=type=secret,id=ENDPOINT_VARIABLES_FRONTEND cat /run/secrets/ENDPOINT_VARIABLES_FRONTEND

# RUN --mount=type=secret,id=PORT_BACKEND echo "done" \
#     --mount=type=secret,id=PORT_FRONTEND echo "done" \
#     --mount=type=secret,id=REDISDB_PORT echo "done" \
#     --mount=type=secret,id=REDISDB_HOST echo "done" \
#     --mount=type=secret,id=REDISDB_PASSWORD echo "done" \
#     --mount=type=secret,id=ENDPOINT_VARIABLES_FRONTEND echo "done"

CMD ["node", "src/index.js"]