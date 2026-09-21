import { generateDailyPuzzle } from '@/server/grid/controllers/daily-puzzle.controller';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const GET = generateDailyPuzzle;
