#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

. "./ci_helpers.sh"
. "./docker_helpers.sh"

#
# docker
#

cd ../..

sha=$(get_commit_sha)
ref=$(get_commit_ref)
tag=$(get_commit_tag)

api_img_sha=$(construct_image_name api $sha)
ui_img_sha=$(construct_image_name ui $sha)
dockerapp_image_sha=$(construct_image_name ente.dockerapp $sha)

upload () {
  img=$1
  as=$2

  docker tag $img $as
  docker push $as
}

upload_dockerapp () {
  l_tag=$1

  docker run \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $(pwd)/ente.dockerapp/:/usr/app/ente.dockerapp/ \
    skn0tt/docker-app \
    "echo $CI_JOB_TOKEN | docker login -u gitlab-ci-token --password-stdin registry.gitlab.com && cd /usr/app/ && docker-app push --tag $l_tag"
}

# tag to use (version, ref, etc)
publish () {
  l_tag=$1

  api_img_ref=$(construct_image_name api $l_tag)
  upload $api_img_sha $api_img_ref

  ui_img_ref=$(construct_image_name ui $l_tag)
  upload $ui_img_sha $ui_img_ref

  dockerapp_image_ref=$(construct_image_name ente.dockerapp $l_tag)
  upload_dockerapp $dockerapp_image_ref
}

echo "### Pulling commit images ###"

docker pull $api_img_sha
docker pull $ui_img_sha
docker pull $dockerapp_image_sha

echo $CI_COMMIT_TAG


# publish by branch
echo "### Pushing images to '$ref' ###"
publish $ref

if [ $ref = "master" ]; then
  echo "### Pushing images to 'latest' ###"
  publish latest
else
  echo "### NOT Pushing images to latest ###"
fi

# publish by tag
if [ "$(is_tagged_build)" = "true" ]; then
  echo "### Pushing images to '$tag' ###"
  publish $tag
else
  echo "### NOT Pushing images to tag ###"
fi
