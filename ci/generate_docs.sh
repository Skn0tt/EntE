#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

# Generates Docs with mkdocs
# Outdir: /site

cd ..

pip install -r requirements.txt
mkdocs build

cd $cwd
