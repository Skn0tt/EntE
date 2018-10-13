#!/usr/bin/env bash

tempfile=$(mktemp)

docker run -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=ente \
  -e MYSQL_PASSWORD=root \
  -e MYSQL_USER=ente \
  --name ente_mariadb \
  mariadb

docker-app render -f ./scripts/dev.config.yml > $tempfile

docker-compose -f "$tempfile" -f ./scripts/docker-compose.dev.yml up

rm "$tempfile"
