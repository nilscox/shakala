#!/usr/bin/env sh

set -a; source ./.env
(cd ../3-backend-infrastructure && pnpm build && node dist/main.js)
