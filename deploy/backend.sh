#!/usr/bin/env sh

app_name=

repo=
branch=

port=
base_url=

db_host=
db_user=
db_name=

email_host=
email_port=
email_user=
email_from=

koyeb service create backend \
  --app "$app_name" \
  --git "$repo" \
  --git-branch "$branch" \
  --git-build-command 'yarn build:backend' \
  --git-run-command 'VERSION=$(git rev-parse HEAD) node -r ./packages/3-backend-infrastructure/register-aliases.js ./packages/3-backend-infrastructure/dist/main.js' \
  --instance-type 'micro' \
  --min-scale 2 \
  --max-scale 2 \
  --ports "$port":http \
  --regions fra \
  --routes "/api:$port" \
  --env NODE_ENV=production \
  --env HOST=0.0.0.0 \
  --env PORT="$port" \
  --env API_BASE_URL="$base_url/api" \
  --env APP_BASE_URL="$base_url" \
  --env DATABASE_HOST="$db_host" \
  --env DATABASE_USER="$db_user" \
  --env DATABASE_NAME="$db_name" \
  --env DATABASE_DEBUG=false \
  --env EMAIL_HOST="$email_host" \
  --env EMAIL_PORT="$email_port" \
  --env EMAIL_SECURE=true \
  --env EMAIL_USER="$email_user" \
  --env EMAIL_FROM="$email_from"

# --secret GITHUB_TOKEN=
# --secret SESSION_SECRET=
# --secret DATABASE_PASSWORD=
# --secret EMAIL_PASSWORD=
