import type { PostgrestMaybeSingleResponse } from '@supabase/supabase-js';

import type { createSupabase } from '@/core/supabase/server';
import type { PlayerTeammateRow } from '@/server/player/types/player.types';

type FindTeammateResult = PostgrestMaybeSingleResponse<
  Pick<PlayerTeammateRow, 'player_id'>
>;

async function findTeammate(
  playerId: string,
  teammateId: string,
  supabase: ReturnType<typeof createSupabase>
): Promise<FindTeammateResult> {
  const [first, second] = [playerId, teammateId].sort();
  return supabase
    .from('player_teammates')
    .select('player_id')
    .eq('player_id', first)
    .eq('teammate_id', second)
    .maybeSingle();
}

export const answerRepository = { findTeammate };
