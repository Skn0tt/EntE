#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

. "./ci_helpers.sh"

# Does the e2e tests.
# Coverage Report can be found in /screenshots/ and /e2e.xml.

cd ..

yarn

./tests/e2e.sh

cd $cwd
