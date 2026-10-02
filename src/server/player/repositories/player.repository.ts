import type { createSupabase } from '@/core/supabase/server';
import type { Player } from '@/domains/player/types/player.types';

type PlayerSearchRow = Player & { total_count: number | string };

async function getPlayers(
  search: string,
  offset: number,
  limit: number,
  supabase: ReturnType<typeof createSupabase>
) {
  const { data, error } = await supabase.rpc('search_players', {
    _search: search,
    _offset: offset,
    _limit: limit,
  });
  const rows = (data ?? []) as PlayerSearchRow[];
  return {
    data: rows.map(({ total_count, ...player }) => {
      void total_count;
      return player;
    }),
    total: rows.length ? Number(rows[0].total_count) : 0,
    error,
  };
}

async function findPlayer(id: string, db: ReturnType<typeof createSupabase>) {
  const { data, error } = await db
    .from('players')
    .select(
      'id, teams, main_team, mvp, dpoy, roy, mip, highest_season_points_total'
    )
    .eq('id', id)
    .maybeSingle();
  return {
    data: data as Pick<
      Player,
      | 'id'
      | 'teams'
      | 'main_team'
      | 'mvp'
      | 'dpoy'
      | 'roy'
      | 'mip'
      | 'highest_season_points_total'
    > | null,
    error,
  };
}

export const playerRepository = { getPlayers, findPlayer };
