import type {
  PostgrestMaybeSingleResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';

import type { createSupabase } from '@/core/supabase/server';

import type {
  PlayerRow,
  SearchPlayerRPC,
} from '@/server/player/types/player.types';

type GetPlayersResult = PostgrestSingleResponse<
  Omit<SearchPlayerRPC, 'total_count'>[]
> & { total: number };
type FindPlayerResult = PostgrestMaybeSingleResponse<
  Pick<
    PlayerRow,
    | 'id'
    | 'name'
    | 'teams'
    | 'main_team'
    | 'mvp'
    | 'dpoy'
    | 'roy'
    | 'mip'
    | 'highest_season_points_total'
  >
>;

async function getPlayers(
  search: string,
  offset: number,
  limit: number,
  supabase: ReturnType<typeof createSupabase>
): Promise<GetPlayersResult> {
  const result = await supabase.rpc('search_players', {
    _search: search,
    _offset: offset,
    _limit: limit,
  });
  if (result.error) return { ...result, total: 0 };
  const rows = result.data;
  return {
    ...result,
    data: rows.map(({ total_count, ...player }) => {
      void total_count;
      return player;
    }),
    total: rows.length ? Number(rows[0].total_count) : 0,
  };
}

async function findPlayer(
  id: string,
  db: ReturnType<typeof createSupabase>
): Promise<FindPlayerResult> {
  return await db
    .from('players')
    .select(
      'id, name, teams, main_team, mvp, dpoy, roy, mip, highest_season_points_total'
    )
    .eq('id', id)
    .maybeSingle();
}

export const playerRepository = { getPlayers, findPlayer };
