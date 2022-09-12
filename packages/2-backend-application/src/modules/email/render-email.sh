#!/bin/sh

yarn nodemon -e mjml -x "yarn mjml $PWD/$1 -o $2"
