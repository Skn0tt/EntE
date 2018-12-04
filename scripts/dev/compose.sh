#!/usr/bin/env bash

IS_CI=${CI:-"false"}
TAG=${TAG:-latest}

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

cd ../..

tempfile=$(mktemp)

docker-app render -f ./scripts/dev/dev.config.yml --set API_TAG="$TAG" --set UI_TAG="$TAG" > $tempfile

if [ "$IS_CI" = "false" ]; then
  docker-compose -f "$tempfile" -f ./scripts/dev/docker-compose.dev.yml "$@"
else
  docker-compose -f "$tempfile" -f ./scripts/dev/docker-compose.ci.yml "$@"
fi

rm "$tempfile"

cd $cwd
