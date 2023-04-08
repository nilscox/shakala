#!/usr/bin/env sh

app_name=

repo=
branch=

port=
base_url=
session_secret=

db_host=
db_user=
db_password=
db_name=

email_host=
email_port=
email_user=
email_password=
email_from=

koyeb service create backend \
  --app "$app_name" \
  --git "$repo" \
  --git-branch "$branch" \
  --git-build-command 'pnpm run-one @shakala/backend-infrastructure build' \
  --git-run-command 'node ./packages/3-backend-infrastructure/dist/main.js' \
  --instance-type 'micro' \
  --min-scale 2 \
  --max-scale 2 \
  --ports "$port":http \
  --regions fra \
  --routes "/api:$port" \
  --env NODE_ENV=production \
  --env HOST=0.0.0.0 \
  --env PORT="$port" \
  --env GITHUB_TOKEN=@github-token \
  --env API_BASE_URL="$base_url/api" \
  --env APP_BASE_URL="$base_url" \
  --env SESSION_SECRET="$session_secret" \
  --env DATABASE_HOST="$db_host" \
  --env DATABASE_USER="$db_user" \
  --env DATABASE_PASSWORD="$db_password" \
  --env DATABASE_NAME="$db_name" \
  --env DATABASE_DEBUG=false \
  --env EMAIL_HOST="$email_host" \
  --env EMAIL_PORT="$email_port" \
  --env EMAIL_SECURE=true \
  --env EMAIL_USER="$email_user" \
  --env EMAIL_PASSWORD="$email_password" \
  --env EMAIL_FROM="$email_from" \
  --env EMAIL_TEMPLATES="../../email-templates"
