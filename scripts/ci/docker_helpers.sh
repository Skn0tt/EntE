#!/usr/bin/env sh

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

# args: name, tag
# returns: imagename
construct_image_name () {
  name=$1
  tag=$2

  baseUrl=$CI_REGISTRY_IMAGE

  result="$baseUrl/$name:$tag"
  echo $result
}

cd $cwd
