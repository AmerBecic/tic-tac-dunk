import {
  createMatch,
  getMatches,
} from '@/server/tic-tac-toe/controllers/tic-tac-toe.controller';

export const dynamic = 'force-dynamic';

export const POST = createMatch;
export const GET = getMatches;
