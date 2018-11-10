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
  "echo $CI_JOB_TOKEN | docker login -u gitlab-ci-token --password-stdin registry.gitlab.com && cd /usr/app/ && docker-app push --tag $tag"

cd $cwd
