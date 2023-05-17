#!/usr/bin/env bash

set -ex;
NPM_TAG=`if [ "$TRAVIS_BRANCH" == "master" ]; then echo "latest"; else echo "$TRAVIS_BRANCH"; fi`;
VERSION_PREFIX=`jq -r '.version' package.json | grep -oP '^\d+\.\d+'`;
VERSION=`echo ${VERSION:-"$VERSION_PREFIX.%s"} | sed "s/%s/$TRAVIS_BUILD_NUMBER/"`;

if [ ${TRAVIS_BRANCH} != ${MASTER_BRANCH:-master} ]; then
  VERSION=${VERSION}-beta;
fi;

npm version ${VERSION} -m "%s [ci skip]";
git push origin HEAD:$TRAVIS_BRANCH;

cp README.md LICENSE package.json target/out
cd target/out
npm publish --tag=$NPM_TAG;