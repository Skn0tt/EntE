#!/usr/bin/env bats

. "./docker_helpers.sh"

@test "returns valid name" {
  result=$(CI_REGISTRY_IMAGE="docker.io/ente" construct_image_name testImage v2)
  echo "# $result" >&3
  [ "$result" = "docker.io/ente/testImage:v2" ]
}
