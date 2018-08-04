#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

# Does the Unit tests.
# Coverage Report can be found in /coverage and /junit.xml.

cd ..

yarn

yarn test:unit:ci

cd $cwd
