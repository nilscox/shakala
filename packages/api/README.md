# Shakala API

## Setup a development environment

0. Install node dependencies

```sh
pnpm install
```

1. Create a .env

```sh
cp .env.example .env
```

2. Run a database

```
podman run -d --name shakala-postgres -e POSTGRES_HOST_AUTH_METHOD=trust -p 5432:5432 postgres
```

3. Seed the database

```
pnpm db:reset
```

4. Start maildev

```
podman run -d --name shakala-maildev -p 1080:1080 -p 1025:1025 maildev/maildev
```
