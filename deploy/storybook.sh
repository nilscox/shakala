#!/usr/bin/env sh

app_name=

repo=
branch=

port=

koyeb service create storybook \
  --app "$app_name" \
  --git "$repo" \
  --git-branch "$branch" \
  --git-build-command 'pnpm workspace @shakala/frontend-client build-storybook' \
  --git-run-command 'npx http-server packages/5-frontend-client/storybook-static' \
  --instance-type 'nano' \
  --min-scale 1 \
  --max-scale 1 \
  --ports "$port:http" \
  --regions fra \
  --routes "/storybook:$port" \
  --env GITHUB_TOKEN=@github-token
  --env PORT="$port" \
  --env PUBLIC_PATH=/storybook
