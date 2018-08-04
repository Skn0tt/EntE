#!/usr/bin/env bats

. "./helpers.sh"

@test "env_variable_exists when it exists" {
  result=$(A=b env_variable_exists A)
  [ "$result" = "true" ]
}

@test "env_variable_exists when doesnt exist" {
  result=$(env_variable_exists A)
  [ "$result" = "false" ]
}