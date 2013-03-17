#!/usr/bin/env bash
if [ -z "$STACKATO_PASSWORD" ]; then
	echo "STACKATO_PASSWORD must be defined"
fi

parse_git_branch() {
   git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}

DEPLOY_NAME="$(parse_git_branch)-rdb"

stackato target https://api.stackato.cil.stack.me
stackato login david.laing@labs.cityindex.com --pass $STACKATO_PASSWORD
stackato push $DEPLOY_NAME --no-prompt
if [ $? -ne 0 ]; then
    stackato update $DEPLOY_NAME --no-prompt
fi