#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

cd ..

node ./scripts/dockerapp-version.js check

cd $cwd
