
cp dockerhub-compose.yaml lastcompose.yaml && \

sed -i s#DOCKER_TAG#2021_06_24T21_55_46#g lastcompose.yaml && \
nerdctl compose -f lastcompose.yaml down  && \
nerdctl compose -f lastcompose.yaml up && \
sed -i s#2021_06_24T21_55_46#DOCKER_TAG#g lastcompose.yaml
