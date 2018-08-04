#!/usr/bin/env sh

version=$1

lerna publish --yes --cd-version $version --skip-git

lernaVersion=$(cat lerna.json | jq -r '.version')

git commit -m "$lernaVersion"
git tag "$lernaVersion"
git push
