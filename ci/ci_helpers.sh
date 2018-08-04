#!/usr/bin/env sh

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

. "./helpers.sh"

is_tagged_build () {
  result=$(env_variable_exists CI_COMMIT_TAG)
  echo $result
}

get_commit_sha () {
  echo $CI_COMMIT_SHA
}

get_commit_ref () {
  echo $CI_COMMIT_REF_SLUG
}

get_commit_tag () {
  echo $CI_COMMIT_TAG
}

cd $cwd
