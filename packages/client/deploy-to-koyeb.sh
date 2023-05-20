#!/usr/bin/env sh

app_name=
service_name=

repo=
branch=

port=

no_index=

api_internal_url=
api_internal_port=

analytics_site_url=
analytics_site_id=

contact_email=
discord_url=
roadmap_url=
feedback_url=
repository_url=

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
  --env NO_INDEX="$no_index" \
  --env VITE_SERVER_API_URL="$api_internal_url:$api_internal_port" \
  --env VITE_CLIENT_API_URL="/api" \
  --env VITE_ANALYTICS_URL="$analytics_site_url" \
  --env VITE_ANALYTICS_SITE_ID="$analytics_site_id" \
  --env VITE_CONTACT_EMAIL="$contact_email" \
  --env VITE_DISCORD_URL="$discord_url" \
  --env VITE_ROADMAP_URL="$roadmap_url" \
  --env VITE_FEEDBACK_URL="$feedback_url" \
  --env VITE_REPOSITORY_URL="$repository_url" \
