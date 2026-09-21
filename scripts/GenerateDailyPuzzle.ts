import 'dotenv/config';

import { createAdminClient } from '@supabase/server/core';

import { generateDailyPuzzle } from '../src/domains/grid/api/services/DailyPuzzleService';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args[0] === '--help') {
    console.log(
      'Usage: pnpm daily:generate [YYYY-MM-DD] (defaults to today in UTC)'
    );
    return;
  }

  const date = args[0] ?? new Date().toISOString().slice(0, 10);
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (
    args.length > 1 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new Error(
      'Provide a valid UTC date: pnpm daily:generate [YYYY-MM-DD]'
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !secretKey) {
    throw new Error(
      'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.'
    );
  }
  const supabase = createAdminClient({
    env: { url, secretKeys: { default: secretKey } },
  });

  const result = await generateDailyPuzzle(date, supabase);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : 'Daily puzzle generation failed.'
  );
  process.exitCode = 1;
});
