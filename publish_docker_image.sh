echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
sudo docker build -t $DOCKER_USERNAME/animap:$TRAVIS_COMMIT .
docker tag $DOCKER_USERNAME/animap:$TRAVIS_COMMIT $DOCKER_USERNAME/animap:latest
docker images
docker push $DOCKER_USERNAME/animap:$TRAVIS_COMMIT
docker push $DOCKER_USERNAME/animap:latest