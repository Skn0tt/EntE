#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

. "./ci_helpers.sh"

# Does the e2e tests.
# Coverage Report can be found in /screenshots/ and /e2e.xml.

cd ../..

sha=$(get_commit_sha)

yarn --network-concurrency 1
TAG="$sha" ./scripts/dev/pull.sh

CI=true ./tests/e2e/run.sh $sha

cd $cwd
