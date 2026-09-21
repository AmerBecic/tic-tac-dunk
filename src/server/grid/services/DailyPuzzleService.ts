import type { createSupabase } from '@/core/supabase/Server';
import { gridService } from './GridServices';
import { DAILY_GRID_CONFIG } from '@/domains/grid/types/GridConstants';

interface DailyPuzzleGenerationResult {
  success: true;
  generated: boolean;
  status: 'generated' | 'already_exists' | 'created_concurrently';
  puzzleId: string;
  date: string;
}

async function generateDailyPuzzle(
  date: string,
  supabase: ReturnType<typeof createSupabase>
): Promise<DailyPuzzleGenerationResult> {
  const findPuzzle = async () => {
    const { data, error } = await supabase
      .from('daily_puzzles')
      .select('id, puzzle_date')
      .eq('puzzle_date', date)
      .maybeSingle();
    if (error)
      throw new Error(`Unable to read daily puzzles: ${error.message}`);
    return data;
  };

  const existing = await findPuzzle();
  if (existing) {
    return {
      success: true,
      generated: false,
      status: 'already_exists',
      puzzleId: existing.id,
      date,
    };
  }

  const result = await gridService.generateAndValidate(
    DAILY_GRID_CONFIG,
    supabase
  );
  if (!result.ok) throw new Error(`${result.code}: ${result.message}`);

  const { data, error } = await supabase
    .from('daily_puzzles')
    .insert({ id: `daily:${date}`, puzzle_date: date, grid_data: result.grid })
    .select('id, puzzle_date')
    .single();

  if (error) {
    if (error.code === '23505') {
      const winner = await findPuzzle();
      if (winner) {
        return {
          success: true,
          generated: false,
          status: 'created_concurrently',
          puzzleId: winner.id,
          date,
        };
      }
    }
    throw new Error(`Unable to save daily puzzle: ${error.message}`);
  }

  return {
    success: true,
    generated: true,
    status: 'generated',
    puzzleId: data.id,
    date,
  };
}

export const dailyPuzzleService = {
  generateDailyPuzzle,
};
