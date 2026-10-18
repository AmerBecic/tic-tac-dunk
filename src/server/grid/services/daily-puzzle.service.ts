import type { DailyPuzzle } from '@/domains/grid/types/grid.types';
import { dailyPuzzleRepository } from '../repositories/daily-puzzle.repository';
import type { createSupabase } from '@/core/supabase/server';
import { gridService } from './grid.service';
import { DEFAULT_GRID_CONFIG } from '@/domains/grid/types/grid.constants';
import { AppError } from '@/server/errors/app.error';
import { AppErrorType } from '@/server/types/app-error.types';

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
    if (error) {
      throw new AppError(
        'Unable to load daily puzzle',
        'DAILY_PUZZLE_LOAD_FAILED',
        AppErrorType.INTERNAL_SERVER_ERROR,
        { cause: error }
      );
    }
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

  const grid = await gridService.generateAndValidate(
    DEFAULT_GRID_CONFIG,
    supabase
  );

  const { data, error } = await dailyPuzzleRepository.create(
    { id: `daily:${date}`, date, grid },
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
    throw new AppError(
      'Unable to save daily puzzle',
      'DAILY_PUZZLE_SAVE_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: error }
    );
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
  date: string,
  supabase: ReturnType<typeof createSupabase>
): Promise<DailyPuzzle> {
  const { data, error } = await dailyPuzzleRepository.findByDate(
    date,
    supabase
  );
  if (error) {
    throw new AppError(
      'Unable to load daily puzzle',
      'DAILY_PUZZLE_LOAD_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: error }
    );
  }
  if (!data) {
    throw new AppError(
      'Daily puzzle not found',
      'DAILY_PUZZLE_NOT_FOUND',
      AppErrorType.NOT_FOUND
    );
  }
  return { ...data.grid_data, id: data.id };
}

export const dailyPuzzleService = {
  getDailyPuzzle,
  generateDailyPuzzle,
};
