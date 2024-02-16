# syntax=docker/dockerfile:1.6
FROM mhart/alpine-node:16.4.2 as builder
WORKDIR /usr/src/app
COPY package*.json ./
# RUN npm ci --only=production
RUN --mount=type=cache,target=~/.npm/_cacache npm ci --only=production

COPY ./src ./src


RUN npm install -g pkg && \
    pkg ./src/index.js --targets node16-linux-x64 --compress GZip --output /usr/src/app/backend -c ./package.json

FROM busybox:latest AS util_builder

FROM gcr.io/distroless/cc:nonroot

USER 1001
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/backend .
COPY --from=util_builder /bin/wget /usr/bin/wget

CMD [ "/usr/src/app/backend" ]

HEALTHCHECK --interval=60s \
    --start-period=5s \
    --timeout=10s \
    --retries=3 \
    CMD ["/usr/bin/wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/islive_0_QJFs_a_IiW_mFtZS2_f_A_BQ_NTib_Y3O6Ik_D0WNH9I"]