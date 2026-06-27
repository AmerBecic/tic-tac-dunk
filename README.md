## Getting Started

First, clone https://github.com/AmerBecic/nba-webscrape - and run webscrape scripts

Those scripts will generate: player_team_1950_2024.csv

Drop player_team_1950_2026.csv into tic-tac-dunk/data/csv (in this project)

Run pnpm i 

Then run these scripts in this order:

npx tsx src/database/scripts/generate-player-data-per-season.ts

npx tsx src/database/scripts/generate-raw-player-data.ts

npx tsx src/database/scripts/generate-final-player-data.ts

Install docker desktop & supabase https://supabase.com/docs/guides/local-development/cli/getting-started

Run supabase start

Open http://localhost:54323

Create .env with connection to local Supabase

Run npx prisma migrate dev --name init

Run pnpm run seed

Your DB should be populated

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

