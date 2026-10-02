# 🏀 Tic Tac Dunk

A basketball grid puzzle application with daily puzzles, NBA player search, answer validation, and progress saved in the browser. The interface supports English and Bosnian.

## Tech stack

- **Frontend:** Next.js App Router, React, TypeScript, TanStack Query, next-intl, and SCSS modules.
- **Database:** PostgreSQL through Supabase. Runtime queries live in server repositories.
- **Database tooling:** Prisma for schema, migrations, generated types/client, and seed scripts.
- **Package manager:** pnpm, pinned to version 9.12.0 in `package.json`.

## Prerequisites

- Node.js compatible with the installed Prisma version: `^20.19`, `^22.12`, or `>=24.0`.
- pnpm.
- Docker Desktop, running before starting local Supabase.
- NBA source data or the prepared JSON datasets described below.

The Supabase CLI is a project dependency; run it through `pnpm exec`. Run all commands below from the project directory containing `package.json`.

## Local setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start Supabase and configure the environment

```bash
pnpm exec supabase start
pnpm exec supabase status
cp .env.example .env
```

Fill in `.env` using the local connection details and keys reported by Supabase:

| Variable                               | Purpose                                                                                                                                                               |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Local API URL, normally `http://127.0.0.1:54321`.                                                                                                                     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key for public client configuration.                                                                                                             |
| `SUPABASE_SECRET_KEY`                  | Server-only Supabase secret key used by backend queries and daily generation. Never prefix it with `NEXT_PUBLIC_`.                                                    |
| `DATABASE_URL`                         | PostgreSQL connection URL used by Prisma and seeds. Locally, normally `postgresql://postgres:postgres@127.0.0.1:54322/postgres`.                                      |
| `CRON_SECRET`                          | Secret checked by the daily puzzle cron endpoint against the `Authorization: Bearer <secret>` header.                                                                 |
| `NEXT_PUBLIC_APP_URL`                  | App origin used for canonical and social metadata URLs. Add `NEXT_PUBLIC_APP_URL=http://localhost:3000` to `.env`; this variable is not yet listed in `.env.example`. |

Keep `.env` private. Restart the development server after changing environment values.

Local services normally run at:

- Supabase Studio: <http://127.0.0.1:54323>
- Mailpit: <http://127.0.0.1:54324>
- Supabase API: <http://127.0.0.1:54321>

Use `pnpm exec supabase status` to confirm the actual addresses for your environment.

### 3. Prepare the NBA datasets

Seeding requires these files in `data/json/`:

- `player_seasons.json`
- `players_raw.json`
- `players_final.json`

If you already have the prepared datasets, place them there and continue. Otherwise, follow [Generate or refresh NBA data](#generate-or-refresh-nba-data) before seeding. The repository's placeholder files do not contain the required data.

### 4. Generate the Prisma client and apply migrations

```bash
pnpm prisma:generate
pnpm exec prisma migrate deploy
```

Migrations create the schema and database functions used by runtime queries. Regenerate the Prisma client after schema changes; do not edit `src/core/generated/prisma/` manually.

### 5. Seed the database

```bash
pnpm seed
```

This runs **teams → players → teammates** in order. The number of players depends on the source dataset. Inspect the resulting tables in Supabase Studio.

### 6. Generate today's daily puzzle

```bash
pnpm daily:generate
```

This writes a puzzle for the current **UTC date** to the configured database. It preserves an existing puzzle for that date. Fetching the daily puzzle does not generate a missing one, so this step is necessary for local daily gameplay.

To generate a specific date:

```bash
pnpm daily:generate 2026-10-02
```

### 7. Start the app

```bash
pnpm dev
```

Open <http://localhost:3000>. Daily gameplay is available at <http://localhost:3000/daily>.

## Generate or refresh NBA data

Historical NBA data comes from the companion [NBA scraping repository](https://github.com/AmerBecic/nba-webscrape). Follow that repository's scraping and cleanup instructions, then place its CSV output at:

```text
data/csv/player_team_1950_2026.csv
```

Run the transformations in this order:

```bash
pnpm generate-player-data-per-season
pnpm generate-raw-player-data
pnpm generate-final-player-data
```

The scripts live in `src/core/database/scripts/` and produce:

```text
CSV → player_seasons.json → players_raw.json → players_final.json
```

The final transformation reuses existing player IDs when the player identity matches. Keep the existing `players_final.json` when refreshing data to preserve those IDs where possible. Run `pnpm seed` after preparing the datasets to update the configured database.

## Project structure

| Location        | Responsibility                                                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/`      | Localized pages, layouts, and thin API route entry points.                                                                                           |
| `src/assets/`   | Imported assets such as SVG components.                                                                                                              |
| `src/core/`     | Shared infrastructure, configuration, providers, i18n, global styles, and data tooling.                                                              |
| `src/domains/`  | Shared business contracts, API request clients, and API query/mutation hooks.                                                                        |
| `src/features/` | UI and frontend business-logic hooks. `shared/ui/` contains UI primitives; other shared folders contain reusable application components and layouts. |
| `src/server/`   | Backend controllers, services, repositories, and helpers.                                                                                            |
| `messages/`     | English and Bosnian translation catalogs.                                                                                                            |
| `public/`       | Static assets served by URL.                                                                                                                         |
| `prisma/`       | Schema, migrations, and seed scripts.                                                                                                                |
| `supabase/`     | Local Supabase configuration.                                                                                                                        |
| `scripts/`      | Command-line workflows, including daily puzzle generation.                                                                                           |
| `data/`         | Source CSV and transformed JSON datasets.                                                                                                            |

The main request flow is:

```text
Feature → domain API hook/request → HTTP route → controller → service → repository → database
```

Command-line workflows call services directly. Detailed development conventions live in the root [AGENTS.md](AGENTS.md) and the layer guides for [core](src/core/AGENTS.md), [domains](src/domains/AGENTS.md), [features](src/features/AGENTS.md), and [server](src/server/AGENTS.md).

## Development commands

| Command                     | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `pnpm dev`                  | Start the development server.                  |
| `pnpm lint`                 | Run ESLint.                                    |
| `pnpm typecheck`            | Check application TypeScript types.            |
| `pnpm typecheck:seed`       | Check seed script types.                       |
| `pnpm build`                | Create a production build.                     |
| `pnpm start`                | Serve an existing production build.            |
| `pnpm scss-types`           | Generate SCSS module type declarations.        |
| `pnpm scss-types:watch`     | Regenerate SCSS declarations as styles change. |
| `pnpm prisma:generate`      | Regenerate the Prisma client.                  |
| `pnpm exec prisma validate` | Validate the Prisma schema.                    |
| `pnpm exec supabase stop`   | Stop local Supabase while retaining its data.  |

There is currently no automated test script in `package.json`. Lint, type checks, and a production build are separate validation steps.

### Schema changes

For local schema development, edit `prisma/schema.prisma`, then create and apply a migration:

```bash
pnpm exec prisma migrate dev --name describe_your_change
pnpm prisma:generate
```

Database functions called through repository RPCs are maintained in SQL migrations under `prisma/migrations/`. Use `pnpm exec prisma migrate deploy` to apply existing migrations to a configured environment.

### Reset the local database

The following deletes data in the database targeted by `DATABASE_URL`. Confirm that it points to your local database first:

```bash
pnpm exec prisma migrate reset
pnpm seed
pnpm daily:generate
```

## Daily scheduling and deployment

`vercel.json` configures `/api/cron/daily-puzzle` with the schedule `0 0 * * *`. The application uses UTC dates for daily puzzles. The endpoint requires `CRON_SECRET` through a bearer authorization header and generates a puzzle only if one does not already exist for the date.

For deployment, configure the environment variables above for the target database and app origin, apply migrations, seed the required NBA data, and generate the initial daily puzzle. Keep `CRON_SECRET` consistent with the scheduler's authorization configuration. The local development server does not run the deployed schedule; use `pnpm daily:generate` locally.

## Troubleshooting

- **Supabase will not start:** Check that Docker Desktop is running, then inspect the output of `pnpm exec supabase start`.
- **Missing dataset files during seeding:** Prepare all three JSON files, including the season and raw player data used by the teammate seed.
- **Database tables or RPC functions are missing:** Apply the committed Prisma migrations to the database the app uses.
- **Daily puzzle is empty:** Run `pnpm daily:generate` for today's UTC date against the same database as the app.
- **Cron endpoint returns 401:** Check `CRON_SECRET` and the bearer authorization header.
- **Metadata URLs are incorrect:** Set `NEXT_PUBLIC_APP_URL` to the app origin and restart or rebuild the app.
