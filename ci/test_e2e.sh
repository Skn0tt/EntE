#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

. "./ci_helpers.sh"

# Does the e2e tests.
# Coverage Report can be found in /screenshots/ and /e2e.xml.

cd ..

docker run -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=ente \
  -e MYSQL_PASSWORD=root \
  -e MYSQL_USER=ente \
  mariadb

sha=$(get_commit_sha)
COMPOSEFILE=$(docker-app render -f ./scripts/dev.config.yml --set API_TAG=$sha --set UI_TAG=$sha)
echo "$COMPOSEFILE"
echo "$COMPOSEFILE" | docker-compose -f - up -d

# Logs
echo "$COMPOSEFILE" | docker-compose -f - logs
echo "$COMPOSEFILE" | docker-compose -f - logs -f > compose-logs.txt &
echo "$COMPOSEFILE" | docker-compose -f - logs -f > /dev/stdout &

yarn

./tests/e2e.sh

cd $cwd
