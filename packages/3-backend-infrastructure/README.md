# Shakala backend

## Setup a development environment

### Create a .env

```sh
cp .env.example .env
```

### Create a database

```
podman run -d --name shakala-postgres -e POSTGRES_HOST_AUTH_METHOD=trust -p 5432:5432 postgres
```

### Run the migrations

```
pnpm db:migrate
```

### Start maildev

```
podman run -d --name shakala-maildev -p 1080:1080 -p 1025:1025 maildev/maildev
```
