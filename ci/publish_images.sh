#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

. "./ci_helpers.sh"
. "./docker_helpers.sh"

#
# docker
#

cd ..

sha=$(get_commit_sha)
ref=$(get_commit_ref)
tag=$(get_commit_tag)

api_img_sha=$(construct_image_name api $sha)
ui_img_sha=$(construct_image_name ui $sha)
nginx_proxy_img_sha=$(construct_image_name nginx-proxy $sha)
dockerapp_image_sha="skn0tt/ente.dockerapp:$sha"

docker pull $api_img_sha
docker pull $ui_img_sha
docker pull $nginx_proxy_img_sha
docker pull $dockerapp_image_sha

upload () {
  img=$1
  as=$2

  docker tag $img $as
  docker push $as
}

# tag to use (version, ref, etc)
publish () {
  tag=$1

  api_img_ref=$(construct_image_name api $tag)
  upload $api_img_sha $api_img_ref

  ui_img_ref=$(construct_image_name ui $tag)
  upload $ui_img_sha $ui_img_ref

  nginx_proxy_img_ref=$(construct_image_name nginx-proxy $tag)
  upload $nginx_proxy_img_sha $nginx_proxy_img_ref

  dockerapp_image_ref="skn0tt/ente.dockerapp:$tag"
  upload $dockerapp_image_sha $dockerapp_image_ref
}

# publish by branch
publish $ref

if [ $ref = "master" ]; then
  publish latest
fi

# publish by tag
is_tagged="$(is_tagged_build)"
if [ $is_tagged = "true" ]; then
  publish $tag
fi
