echo ... Building ... && \
DOCKER_BUILDKIT=1 nerdctl build --no-cache --progress=tty -t backend \
  --secret id=PORT_BACKEND,src=./secrets/port_backend.txt \
  --secret id=PORT_FRONTEND,src=./secrets/port_frontend.txt \
  --secret id=REDISDB_PORT,src=./secrets/redisdb_port.txt \
  --secret id=REDISDB_HOST,src=./secrets/redisdb_host.txt \
  --secret id=REDISDB_PASSWORD,src=./secrets/redisdb_password.txt \
  --secret id=ENDPOINT_VARIABLES_FRONTEND,src=./secrets/endpoint_variables_frontend.txt \
  . && \

nerdctl compose -f local.yaml down && \
nerdctl compose -f local.yaml up