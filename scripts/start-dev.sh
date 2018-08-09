#!/usr/bin/env bash

tempfile=$(mktemp)
docker-app render --set API_VERSION=latest --set UI_VERSION=latest > $tempfile

docker-compose -f $tempfile -f docker-compose.dev.yml up

rm $tempfile
