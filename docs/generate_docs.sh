#!/usr/bin/env sh

set -e

(cd en && mkdocs build)
(cd de && mkdocs build)

mkdir public public/de public/en

cp -R ./de/site/* public/
cp -R ./en/site/* public/en/
cp -R ./de/site/* public/de/
