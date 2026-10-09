import type { PostgrestSingleResponse } from '@supabase/supabase-js';

import type { createSupabase } from '@/core/supabase/server';
import type { Grid } from '@/domains/grid/types/grid.types';
import type {
  EligiblePlayerRPC,
  GridAnswerRPC,
  GridValidationRPC,
  RandomTeamRPC,
} from '@/server/grid/types/grid.types';

type GetRandomTeamsResult = PostgrestSingleResponse<RandomTeamRPC[]>;
type GetRandomEligiblePlayersResult = PostgrestSingleResponse<
  EligiblePlayerRPC[]
>;
type ValidateGridResult = PostgrestSingleResponse<GridValidationRPC[]>;
type FindGridAnswersResult = PostgrestSingleResponse<GridAnswerRPC[]>;

async function getRandomTeams(
  count: number,
  supabase: ReturnType<typeof createSupabase>
): Promise<GetRandomTeamsResult> {
  return await supabase.rpc('get_random_teams', {
    requested_count: count,
  });
}

async function getRandomEligiblePlayers(
  count: number,
  supabase: ReturnType<typeof createSupabase>
): Promise<GetRandomEligiblePlayersResult> {
  return await supabase.rpc('get_random_eligible_players', {
    requested_count: count,
  });
}

async function validateGrid(
  grid: Grid,
  supabase: ReturnType<typeof createSupabase>
): Promise<ValidateGridResult> {
  return await supabase.rpc('validate_grid', {
    _rows: grid.rows,
    _columns: grid.columns,
  });
}

async function findGridAnswers(
  grid: Grid,
  supabase: ReturnType<typeof createSupabase>
): Promise<FindGridAnswersResult> {
  return await supabase.rpc('find_grid_answers', {
    _rows: grid.rows,
    _columns: grid.columns,
  });
}

export const gridRepository = {
  findGridAnswers,
  getRandomTeams,
  getRandomEligiblePlayers,
  validateGrid,
};
