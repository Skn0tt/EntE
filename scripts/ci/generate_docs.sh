#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

###

# Generates Docs with mkdocs

cd ../..

root=$(pwd)

pip3 install -r ./docs/requirements.txt

# English
cd $root/docs/en/

mkdocs build

# German

cd $root/docs/de

mkdocs build

###

cd $cwd

mkdir docs_dist docs_dist/de docs_dist/en
cp -R docs/de/site/* docs_dist/
cp -R docs/en/site/* docs_dist/en/
cp -R docs/de/site/* docs_dist/de/
