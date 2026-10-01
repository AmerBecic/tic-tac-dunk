import type { createSupabase } from '@/core/supabase/server';
import type { Grid } from '@/domains/grid/types/grid.types';

async function findByDate(
  date: string,
  supabase: ReturnType<typeof createSupabase>
) {
  return await supabase
    .from('daily_puzzles')
    .select('id, puzzle_date, grid_data')
    .eq('puzzle_date', date)
    .maybeSingle();
}

async function create(
  puzzle: { id: string; date: string; grid: Grid },
  supabase: ReturnType<typeof createSupabase>
) {
  return await supabase
    .from('daily_puzzles')
    .insert({ id: puzzle.id, puzzle_date: puzzle.date, grid_data: puzzle.grid })
    .select('id, puzzle_date')
    .single();
}

async function findById(
  id: string,
  supabase: ReturnType<typeof createSupabase>
) {
  return supabase
    .from('daily_puzzles')
    .select('id, grid_data')
    .eq('id', id)
    .maybeSingle();
}

export const dailyPuzzleRepository = {
  findById,
  findByDate,
  create,
};
