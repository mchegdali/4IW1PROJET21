# Fanthesie Server

## Setup

Install [Docker](https://docs.docker.com/get-docker/).

Copy `.env.exemple` to `.env` and fill the variables.

```bash
cp .env.exemple .env
```

## Usage

### Start the server

```bash
docker compose up
```

### Stop the server

```bash
docker compose down
```

### Migrations

Apply migrations:

```bash
docker compose exec node npm run db:migrate
```

### Fixtures

Seed the database:

```bash
docker compose exec node npm run db:seed:up
```

Revert all seed data:

```bash
docker compose exec node npm run db:seed:down
```
