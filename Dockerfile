FROM node:15.12.0-alpine3.13

# set NODE_ENV 
ENV NODE_ENV=development && \
    MONGO_DB_URI=mongodb+srv://jose:jose@cluster0.6oq5a.gcp.mongodb.net/test?retryWrites=true&w=majority?keepAlive=true&poolSize=30&autoReconnect=true&socketTimeoutMS=360000&connectTimeoutMS=360000 && \
    MONGO_DB_NAME=rentacar && \
    MONGO_COLECCION_CARS=cars && \
    NODE_EXPRESS_PORT=3000

RUN adduser -D usuarioapp

USER usuarioapp

WORKDIR /home/usuarioapp

# listening port
EXPOSE ${NODE_EXPRESS_PORT}

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