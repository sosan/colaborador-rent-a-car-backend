FROM grafana/fluent-bit-plugin-loki:latest
COPY ./fluent-bit.conf  /fluent-bit/etc/fluent-bit.conf
CMD ["/fluent-bit/bin/fluent-bit", "-e", "/fluent-bit/bin/out_grafana_loki.so", "-c", "/fluent-bit/etc/fluent-bit.conf"]