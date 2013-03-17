#!/usr/bin/env bash
if [ -z "$STACKATO_PASSWORD" ]; then
	echo "STACKATO_PASSWORD must be defined"
fi

if [ -z "$sha1" ]; then
	echo "sha1 must be defined to contain the git branch being built, eg origin/pr/3/merge"
fi

PULL_REQUEST="$(echo $sha1 | sed -r 's/(origin|merge|\/)//g')"
DEPLOY_NAME="$PULL_REQUEST-remote-development-boilerplate"

echo "deploying pull request: $PULL_REQUEST to url: http://$DEPLOY_NAME.stackato.cil.stack.me"

stackato target https://api.stackato.cil.stack.me
stackato login david.laing@labs.cityindex.com --pass $STACKATO_PASSWORD
stackato push $DEPLOY_NAME --no-prompt
if [ $? -ne 0 ]; then
    stackato update $DEPLOY_NAME --no-prompt
fi