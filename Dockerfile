FROM node:15.14.0-alpine3.13

RUN adduser -D usuarioapp

USER usuarioapp

WORKDIR /home/usuarioapp

# listening port
EXPOSE ${PORT_BACKEND}

# copy project file
COPY package*.json ./

# copy app files
COPY /src /src  && \
    /public /public

RUN apk add --no-cache --virtual npm config set depth 0 && \
    npm ci --only=production && \
    npm cache clean && \
    rm -rf /tmp/*


ENTRYPOINT ["npm", "run", "start"]