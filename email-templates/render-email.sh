#!/bin/sh

pnpm nodemon -w . -e mjml -x "pnpm mjml $PWD/$1 -o $2 && sed -i 's|{{appBaseUrl}}|http://localhost:8000|g' $2"
