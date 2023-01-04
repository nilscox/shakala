#!/usr/bin/env sh

app_name=

repo=
branch=

port=

analytics_site_url=
analytics_site_id=

koyeb service create frontend \
  --app "$app_name" \
  --git "$rep" \
  --git-branch "$branch" \
  --git-build-command 'pnpm run-one @shakala/frontend-client build' \
  --git-run-command 'pnpm run-one @shakala/frontend-client start' \
  --instance-type 'nano' \
  --min-scale 2 \
  --max-scale 2 \
  --ports "$port":http \
  --regions fra \
  --routes "/:$port" \
  --env GITHUB_TOKEN=@github-token
  --env PORT="$port" \
  --env API_URL=/api \
  --env ANALYTIC_URL="$analytics_url" \
  --env ANALYTIC_SITE_ID="$analytics_site_id"

