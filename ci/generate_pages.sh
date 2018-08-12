#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

# generates allure report
# OutDir: allure-report

cd ../pages

npm install
npm run build

cd $cwd
