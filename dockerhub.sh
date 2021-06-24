
sed -i s#DOCKER_TAG#2021_06_24T11_01_24#g dockerhub-compose.yaml && \
nerdctl compose -f dockerhub-compose.yaml down  && \
nerdctl compose -f dockerhub-compose.yaml up && \
sed -i s#2021_06_24T11_01_24#DOCKER_TAG#g dockerhub-compose.yaml
