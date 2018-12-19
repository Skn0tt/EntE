#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

# Generates Docs with mkdocs
# Outdir: /site

cd ../..

pip install -r ./docs/requirements.txt
mkdocs build

cd $cwd
