#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

cd ../../assets/pages

npm install
npm run build:prod

cd $cwd
