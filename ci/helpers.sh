#!/usr/bin/env sh

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

# Args: Env-Variable
# Returns: "true" | "false"
env_variable_exists () {
  env_variable=$1

  val=${!env_variable}

  if [ -z "$val" ]; then
    echo "false"
  else
    echo "true"
  fi
}

cd $cwd
