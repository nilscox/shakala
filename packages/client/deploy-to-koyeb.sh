#!/usr/bin/env sh

app_name=
service_name=

repo=
branch=

port=

api_internal_url=
api_internal_port=

koyeb service create "$service_name" \
  --app "$app_name" \
  --git "$repo" \
  --git-branch "$branch" \
  --git-build-command 'pnpm run --filter @shakala/client build' \
  --git-run-command 'pnpm run --filter @shakala/client start' \
  --instance-type nano \
  --min-scale 2 \
  --max-scale 2 \
  --ports "$port:http" \
  --regions fra \
  --routes "/:$port" \
  --env GITHUB_TOKEN="@github-token" \
  --env NODE_ENV="production" \
  --env HOST="0.0.0.0" \
  --env PORT="$port" \
  --env VITE_SERVER_API_URL="$api_internal_url:$api_internal_port" \
  --env VITE_CLIENT_API_URL="/api"
