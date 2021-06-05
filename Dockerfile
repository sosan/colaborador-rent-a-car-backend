FROM node:15.14.0-alpine3.13
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

# copy app files
COPY ./src ./src

# RUN apk add --no-cache --virtual npm config set depth 0
# RUN npm config set depth 0
# RUN npm cache clean
# RUN rm -rf /tmp/*

# listening port
EXPOSE 3000
USER node

ENTRYPOINT ["npm", "run", "start"]