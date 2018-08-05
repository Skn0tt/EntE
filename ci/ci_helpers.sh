#!/usr/bin/env sh

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

is_tagged_build () {
  if [ -n "${CI_COMMIT_TAG+set}" ]; then
    echo "true"
  else
    echo "false"
  fi
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
