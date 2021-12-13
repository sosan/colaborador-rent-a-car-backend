FROM envoyproxy/envoy-alpine:v1.20.1
# FROM envoyproxy/envoy-distroless:v1.20.1

RUN apk --no-cache add ca-certificates
COPY --chown=1001:1001 ./config_frontend_envoy.yaml /etc/front-envoy.yaml
# RUN chmod go+r /etc/front-envoy.yaml
USER 1001
CMD ["/usr/local/bin/envoy", "-c /etc/front-envoy.yaml" ]
