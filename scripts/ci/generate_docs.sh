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
