# 🏀 Tic Tac Dunk

A basketball player data application built with **Next.js**, **Prisma**, **PostgreSQL**, and **Supabase**.

The project uses historical NBA player data generated from the companion scraping repository:

```text
https://github.com/AmerBecic/nba-webscrape
```

## 🛠 Tech Stack

- ⚛️ **Frontend:** Next.js, React, TypeScript
- 🗄️ **Database:** PostgreSQL
- 🔺 **Backend Platform:** Supabase
- 🧩 **ORM:** Prisma
- 📦 **Package Manager:** pnpm

---

## 📋 Prerequisites

Before running the project locally, install:

- Node.js 20+
- pnpm
- Docker Desktop
- Supabase CLI is installed as a project dependency and is run through `pnpm exec`

Make sure Docker Desktop is open and running before starting Supabase.

You can verify Docker with:

```bash
docker ps
```

---

## 1. 🏀 Generate NBA player source data

Clone the NBA scraping repository separately:

```bash
git clone git@github.com:AmerBecic/nba-webscrape.git
cd nba-webscrape
```

Follow the setup instructions in that repository and run the scraper and cleanup notebooks.

The final output should be:

```text
player_team_1950_2026.csv
```

Copy that file into this project:

```text
tic-tac-dunk/data/csv/player_team_1950_2026.csv
```

Return to the Tic Tac Dunk project directory:

```bash
cd ../tic-tac-dunk
```

---

## 2. ⚙️ Generate application data files

Run these scripts in this exact order:

```bash
pnpm exec tsx src/database/scripts/generate-player-data-per-season.ts
pnpm exec tsx src/database/scripts/generate-raw-player-data.ts
pnpm exec tsx src/database/scripts/generate-final-player-data.ts
```

These scripts transform the scraped NBA season data into the final player dataset used by the database seed.

---

## 3. 🔺 Start local Supabase

Start Docker Desktop first.

Then, from the project root, start the local Supabase stack:

```bash
pnpm exec supabase start
```

After Supabase starts, local services will be available at:

```text
Supabase Studio: http://127.0.0.1:54323
Mailpit:         http://127.0.0.1:54324
Project URL:     http://127.0.0.1:54321
Database URL:    postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

You can inspect your local database in Supabase Studio:

```text
http://127.0.0.1:54323
```

To see the current Supabase status, URLs, and local keys:

```bash
pnpm exec supabase status
```

---

## 4. 🧩 Generate Prisma Client

Generate the Prisma Client after installing dependencies or changing the Prisma schema:

```bash
pnpm exec prisma generate
```

---

## 5. 🗃️ Apply database migrations

Apply the committed Prisma migrations to your local Supabase database:

```bash
pnpm exec prisma migrate deploy
```

For normal development, when you make a new Prisma schema change and want to create a migration, use:

```bash
pnpm exec prisma migrate dev --name your_migration_name
```

Example:

```bash
pnpm exec prisma migrate dev --name add_player_statistic
```

---

## 6. 🌱 Seed the database

Populate the local database with generated player data:

```bash
pnpm run seed
```

A successful seed should insert approximately:

```text
4853 players
```

You can confirm the data in Supabase Studio under the `players` table.

---

## 7. 🚀 Run the development server

```bash
pnpm dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## 💻 Useful Commands

```bash
# Start local Supabase
pnpm exec supabase start

# Stop local Supabase while keeping local database data
pnpm exec supabase stop

# Show Supabase service URLs and local keys
pnpm exec supabase status

# Generate Prisma Client
pnpm exec prisma generate

# Validate Prisma schema
pnpm exec prisma validate

# Apply existing Prisma migrations
pnpm exec prisma migrate deploy

# Create and apply a new migration during development
pnpm exec prisma migrate dev --name migration_name

# Seed the database
pnpm run seed

# Reset the local database, reapply migrations, then seed manually
pnpm exec prisma migrate reset
pnpm run seed

# Run linting
pnpm lint

# Create a production build
pnpm build
```

---

## 🔄 Local Database Reset

To completely remove local database data and recreate it from Prisma migrations:

```bash
pnpm exec prisma migrate reset
```

Then seed the database again:

```bash
pnpm run seed
```
