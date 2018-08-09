#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

. "./ci_helpers.sh"
. "./docker_helpers.sh"

cd ..

build () {
  path=$1
  name=$2

  cwd=$(pwd)

  cd $path

  sha=$(get_commit_sha)
  tag=$(construct_image_name $name $sha)

  make build IMAGE_TAG=$tag

  docker push $tag

  cd $cwd
}

img=$1
if [ $img = "api" ]; then
  build packages/ente-api api
elif [ $img = "ui" ]; then
  build packages/ente-ui ui
else
  echo "Please specify valid img"
fi

cd $cwd
