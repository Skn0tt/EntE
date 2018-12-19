#!/usr/bin/env bats

. "./ci_helpers.sh"

@test "is_tagged_build returns true when it is tagged" {
  result=$(CI_COMMIT_TAG=b is_tagged_build)
  [ "$result" = "true" ]
}

@test "is_tagged_build returns false when it is not tagged" {
  result=$(is_tagged_build)
  [ "$result" = "false" ]
}