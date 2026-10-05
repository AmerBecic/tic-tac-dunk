import type { createSupabase } from '@/core/supabase/server';
import type { Grid } from '@/domains/grid/types/grid.types';

type Team = { code: string; name: string; included_names: string[] };
type CluePlayer = { id: string; name: string };

async function getRandomTeams(
  count: number,
  supabase: ReturnType<typeof createSupabase>
) {
  const { data, error } = await supabase.rpc('get_random_teams', {
    requested_count: count,
  });
  return { data: (data ?? []) as Team[], error };
}

async function getRandomEligiblePlayers(
  count: number,
  supabase: ReturnType<typeof createSupabase>
) {
  const { data, error } = await supabase.rpc('get_random_eligible_players', {
    requested_count: count,
  });
  return { data: (data ?? []) as CluePlayer[], error };
}

async function validateGrid(
  grid: Grid,
  supabase: ReturnType<typeof createSupabase>
) {
  return await supabase.rpc('validate_grid', {
    _rows: grid.rows,
    _columns: grid.columns,
  });
}

async function findGridAnswers(
  grid: Grid,
  supabase: ReturnType<typeof createSupabase>
) {
  const { data, error } = await supabase.rpc('find_grid_answers', {
    _rows: grid.rows,
    _columns: grid.columns,
  });
  return {
    data: (data ?? []) as Array<{
      row_index: number;
      column_index: number;
      player_id: string | null;
    }>,
    error,
  };
}

export const gridRepository = {
  findGridAnswers,
  getRandomTeams,
  getRandomEligiblePlayers,
  validateGrid,
};
