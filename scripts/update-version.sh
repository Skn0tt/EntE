#!/usr/bin/env sh

version=$1

lerna publish --force-publish --yes --cd-version $version --skip-git

lernaVersion="v$(cat lerna.json | jq -r '.version')"

./scripts/dockerapp-version.js update

git commit -am "$lernaVersion"
git tag "$lernaVersion"
git push
git push --tags
