FROM node:15.14.0-alpine3.13

RUN adduser -D usuarioapp

USER usuarioapp

WORKDIR /home/usuarioapp

# listening port
EXPOSE 3000

# copy project file
COPY package*.json ./

# copy app files
COPY /src /src
COPY /public /public

RUN apk add --no-cache --virtual npm config set depth 0
RUN npm ci --only=production && \
RUN npm cache clean && \
RUN rm -rf /tmp/*

ENTRYPOINT ["npm", "run", "start"]