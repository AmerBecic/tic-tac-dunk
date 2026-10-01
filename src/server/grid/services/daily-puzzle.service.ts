import type { Grid, DailyPuzzle } from '@/domains/grid/types/grid.types';
import { dailyPuzzleRepository } from '../repositories/daily-puzzle.repository';
import type { createSupabase } from '@/core/supabase/server';
import { gridService } from './grid.service';
import { DAILY_GRID_CONFIG } from '@/domains/grid/types/grid.constants';

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
    const { data, error } = await dailyPuzzleRepository.findByDate(
      date,
      supabase
    );
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

  const { data, error } = await dailyPuzzleRepository.create(
    { id: `daily:${date}`, date, grid: result.grid },
    supabase
  );

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

async function getDailyPuzzle(
  supabase: ReturnType<typeof createSupabase>
): Promise<DailyPuzzle | null> {
  const date = new Date().toISOString().slice(0, 10);
  const { data, error } = await dailyPuzzleRepository.findByDate(
    date,
    supabase
  );
  if (error) throw new Error(`Unable to read daily puzzle: ${error.message}`);
  return data ? { ...(data.grid_data as Grid), id: data.id } : null;
}

export const dailyPuzzleService = {
  getDailyPuzzle,
  generateDailyPuzzle,
};
