#!/usr/bin/env bash

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

cd ../..

./scripts/dev/compose.sh up "$@"

cd $cwd
