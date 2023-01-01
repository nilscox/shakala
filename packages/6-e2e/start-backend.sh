#!/usr/bin/env sh

set -a; source ./.env
(cd ../3-backend-infrastructure && node dist/main.js)
