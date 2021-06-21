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

# RUN --mount=type=secret,id=PORT_FRONTEND port_frontend=$(cat /run/secrets/PORT_FRONTEND) && export PORT_FRONTEND=$port_frontend
# RUN --mount=type=secret,id=PORT_BACKEND PORT_BACKEND="$(cat /run/secrets/PORT_BACKEND)" && export PORT_BACKEND
# RUN --mount=type=secret,id=REDISDB_PORT REDISDB_PORT="$(cat /run/secrets/REDISDB_PORT)" && export REDISDB_PORT
# RUN --mount=type=secret,id=REDISDB_HOST REDISDB_HOST="$(cat /run/secrets/REDISDB_HOST)" && export REDISDB_HOST
# RUN --mount=type=secret,id=REDISDB_PASSWORD REDISDB_PASSWORD="$(cat /run/secrets/REDISDB_PASSWORD)" && export REDISDB_PASSWORD
# RUN --mount=type=secret,id=ENDPOINT_VARIABLES_FRONTEND ENDPOINT_VARIABLES_FRONTEND="$(cat /run/secrets/ENDPOINT_VARIABLES_FRONTEND)"  && export ENDPOINT_VARIABLES_FRONTEND


# RUN --mount=type=secret,id=PORT_FRONTEND export PORT_FRONTEND=$(cat /run/secrets/PORT_FRONTEND)
# RUN --mount=type=secret,id=PORT_BACKEND export PORT_BACKEND=$(cat /run/secrets/PORT_BACKEND)
# RUN --mount=type=secret,id=REDISDB_PORT export REDISDB_PORT=$(cat /run/secrets/REDISDB_PORT)
# RUN --mount=type=secret,id=REDISDB_HOST export REDISDB_HOST=$(cat /run/secrets/REDISDB_HOST)
# RUN --mount=type=secret,id=REDISDB_PASSWORD export REDISDB_PASSWORD=$(cat /run/secrets/REDISDB_PASSWORD)
# RUN --mount=type=secret,id=ENDPOINT_VARIABLES_FRONTEND export ENDPOINT_VARIABLES_FRONTEND=$(cat /run/secrets/ENDPOINT_VARIABLES_FRONTEND)

# RUN cat /run/secrets/REDISDB_HOST

RUN --mount=type=secret,id=PORT_BACKEND cat /run/secrets/PORT_BACKEND
RUN --mount=type=secret,id=PORT_FRONTEND cat /run/secrets/PORT_FRONTEND
RUN --mount=type=secret,id=REDISDB_PORT cat /run/secrets/REDISDB_PORT
RUN --mount=type=secret,id=REDISDB_HOST cat /run/secrets/REDISDB_HOST
RUN --mount=type=secret,id=REDISDB_PASSWORD cat /run/secrets/REDISDB_PASSWORD
RUN --mount=type=secret,id=ENDPOINT_VARIABLES_FRONTEND cat /run/secrets/ENDPOINT_VARIABLES_FRONTEND

CMD ["node", "src/index.js"]