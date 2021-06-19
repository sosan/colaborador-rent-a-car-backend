FROM mhart/alpine-node:16.2.0
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --only=production

# # imagen2 sin npm o yarn
FROM mhart/alpine-node:slim-16.2.0

WORKDIR /usr/src/app
COPY --from=0 /usr/src/app ./
COPY ./src ./src
CMD ["node", "src/index.js"]