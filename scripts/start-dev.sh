#!/usr/bin/env bash

tempfile=$(mktemp)

docker-app render -f ./scripts/dev.config.yml > $tempfile

docker-compose -f "$tempfile" -f ./scripts/docker-compose.dev.yml up "$@"

rm "$tempfile"
