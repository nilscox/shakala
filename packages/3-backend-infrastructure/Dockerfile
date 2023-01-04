FROM node:18

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

ARG GITHUB_TOKEN
WORKDIR /app
EXPOSE 8080

ADD .npmrc pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install -r --frozen-lockfile

RUN pnpm run-one @shakala/backend-infrastructure build

# not yet supported on monorepos
# RUN pnpm prune --prod
RUN rm -rf node_modules packages/*/node_modules && pnpm install -r --prod

CMD node packages/3-backend-infrastructure/dist/main.js
