#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

cd ..

ts-node ./scripts/dockerapp-version.ts check

cd $cwd
