#!/usr/bin/env sh

set -e

cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

# generates allure report
# OutDir: allure-report

cd ../..

allure generate ./

cd $cwd
