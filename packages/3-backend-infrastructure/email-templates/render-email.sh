#!/bin/sh

yarn nodemon -w . -e mjml -x "yarn mjml $PWD/$1 -o $2 && sed -i 's|{{appBaseUrl}}|http://localhost:8000|g' $2"
