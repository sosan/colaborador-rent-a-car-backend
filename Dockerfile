FROM envoyproxy/envoy-alpine:v1.19-latest

ARG EMAIL_CERTIFICATION
ARG DOMAIN_1
ARG DOMAIN_2



RUN apk --no-cache add ca-certificates
COPY --chown=1001:1001 ./config_frontend_envoy.yaml /etc/front-envoy.yaml
RUN chmod go+r /etc/front-envoy.yaml
    # && chmod go+x /etc/cert.pem \
    # && chmod go+x /etc/privkey.pem \
    # && chmod go+r /etc/certs/*
CMD /usr/local/bin/envoy -c /etc/front-envoy.yaml