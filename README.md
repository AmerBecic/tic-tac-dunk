# 🏀 Tic Tac Dunk

A basketball grid puzzle application with tic tac toe games and daily puzzles.

## 🧰 Tech stack

- **Frontend:** Next.js App Router, React, TypeScript, TanStack Query, next-intl, and SCSS modules.
- **Database:** PostgreSQL through Supabase, Prisma.
- **Package manager:** pnpm, pinned to version 9.12.0 in `package.json`.

## ✅ Prerequisites

- Node.js compatible with the installed Prisma version: `^20.19`, `^22.12`, or `>=24.0`.
- pnpm.
- Docker Desktop, running before starting local Supabase.
- NBA source data or the prepared JSON datasets described below.

The Supabase CLI is a project dependency; run it through `pnpm exec`. Run all commands below from the project directory containing `package.json`.

## 🚀 Local setup

### 1. 📦 Install dependencies

```bash
pnpm install
```

### 2. 🗄️ Start Supabase and configure the environment

```bash
pnpm exec supabase start
pnpm exec supabase status
cp .env.example .env
```

Create `.env` from `.env.example` using the `cp` command above.

For the sample dataset, disable award and 2,000+ season-point categories in `.env`:

```dotenv
GRID_ENABLE_AWARDS=false
GRID_ENABLE_STATS=false
```

Each setting can be toggled independently. Set it to `true` (the default when omitted) to enable that category again. Restart the app after changing these values. They apply to new daily puzzles and games against AI; saved daily puzzles are unchanged. Grids still require enough team and teammate overlap in the seeded data.

### 3. 🏀 Prepare the NBA datasets

The included [synthetic testing dataset](data/csv/tic_tac_dunk_synthetic_dataset.csv) uses real player–team links from the last two seasons (2026 and 2027) and adds 130 fictional player–team links to make grids easier to generate and solve during testing. These added links are marked with `IsSynthetic=True`. This dataset is intended for testing, not accurate NBA history.

Copy the testing dataset to the filename expected by the importer, then generate the JSON files:

```bash
cp data/csv/tic_tac_dunk_synthetic_dataset.csv data/csv/player_team_1950_2027.csv
pnpm generate-player-data-per-season
pnpm generate-raw-player-data
pnpm generate-final-player-data
```

This creates the files required for seeding in `data/json/`:

- `player_seasons.json`
- `players_raw.json`
- `players_final.json`

### 4. 🧬 Generate the Prisma client and apply migrations

```bash
pnpm prisma:generate
pnpm exec prisma migrate deploy
```

Migrations create the schema and database functions used by runtime queries. Regenerate the Prisma client after schema changes; do not edit `src/core/generated/prisma/` manually.

### 5. 🌱 Seed the database

```bash
pnpm seed
```

This runs **teams → players → teammates** in order. The number of players depends on the source dataset. Inspect the resulting tables in Supabase Studio.

### 6. 🧩 Generate today's daily puzzle

```bash
pnpm daily:generate
```

This writes a puzzle for the current **UTC date** to the configured database. It preserves an existing puzzle for that date. Fetching the daily puzzle does not generate a missing one, so this step is necessary for local daily gameplay.

To generate a specific date:

```bash
pnpm daily:generate 2026-10-02
```

### 7. ▶️ Start the app

```bash
pnpm dev
```

Open <http://localhost:3000>. Daily gameplay is available at <http://localhost:3000/daily>.

## 🔄 Generate or refresh NBA data

Historical NBA data comes from the companion [NBA scraping repository](https://github.com/AmerBecic/nba-webscrape). Follow that repository's scraping and cleanup instructions, then place its CSV output at:

```text
data/csv/player_team_1950_2027.csv
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

## 🗂️ Project structure

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

## 🛠️ Development commands

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

### 🧱 Schema changes

For local schema development, edit `prisma/schema.prisma`, then create and apply a migration:

```bash
pnpm exec prisma migrate dev --name describe_your_change
pnpm prisma:generate
```

Database functions called through repository RPCs are maintained in SQL migrations under `prisma/migrations/`. Use `pnpm exec prisma migrate deploy` to apply existing migrations to a configured environment.

### ♻️ Reset the local database

The following deletes data in the database targeted by `DATABASE_URL`. Confirm that it points to your local database first:

```bash
pnpm exec prisma migrate reset
pnpm seed
pnpm daily:generate
```
