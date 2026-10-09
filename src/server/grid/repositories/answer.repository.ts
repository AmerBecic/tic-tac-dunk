import type { createSupabase } from '@/core/supabase/server';

async function findTeammate(
  playerId: string,
  teammateId: string,
  db: ReturnType<typeof createSupabase>
) {
  const [first, second] = [playerId, teammateId].sort();
  return db
    .from('player_teammates')
    .select('player_id')
    .eq('player_id', first)
    .eq('teammate_id', second)
    .maybeSingle();
}

export const answerRepository = { findTeammate };
