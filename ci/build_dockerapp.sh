#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

. "./ci_helpers.sh"

cd ..

tag=$(get_commit_sha)

docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd)/ente.dockerapp/:/usr/app/ente.dockerapp/ \
  skn0tt/docker-app \
  "echo $DOCKER_HUB_PASSWORD | docker login --username skn0tt --password-stdin && cd /usr/app/ && docker-app push --tag $tag"

cd $cwd
