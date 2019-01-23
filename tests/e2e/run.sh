#!/usr/bin/env sh

TAG=${1:-latest}
baseUrl=${BASE_URL:-localhost}

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

echo "### Starting Development Environment ###"
echo "### Logs can be found in 'logs.txt'  ###"

TAG="$TAG" ../../scripts/dev/start.sh > logs.txt &

echo "### Sleeping 60 seconds to wait for containers be reachable ###"

sleep 90

echo "### Done sleeping ###"

echo "### Start Test procedure ###"

BASE_URL=$baseUrl yarn test:e2e:ci

e=$?

echo "### Finished testing ###"

sed -i '' -e 's/timestamp=\".*\"//g' ../../e2e.xml

echo "### Stopping Development Environment ###"

# stop env
TAG="$TAG" ../../scripts/dev/stop.sh

wait

cd $cwd

exit $e
