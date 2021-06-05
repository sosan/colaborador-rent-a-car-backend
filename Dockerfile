FROM node:15.14.0-alpine3.13
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY ./src ./src
EXPOSE 3000
USER node
ENTRYPOINT ["npm", "run", "start"]
# RUN apk add --no-cache --virtual npm config set depth 0
# RUN npm config set depth 0
# RUN npm cache clean
# RUN rm -rf /tmp/*
#####################################
FROM node:15.14.0-alpine3.13 as dev

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install
COPY . .

RUN yarn build

FROM nginx:alpine
COPY --from=dev /src/dist /usr/share/nginx/html
EXPOSE 80


