import 'server-only';
import { AppError } from '@/server/errors/app.error';
import { AppErrorType } from '@/server/types/app-error.types';
import { ticTacToeRepository } from '@/server/tic-tac-toe/repositories/tic-tac-toe.repository';
import { teamRepository } from '@/server/team/repositories/team.repository';
import type { createSupabase } from '@/core/supabase/server';
import type { Grid, GridCategory } from '@/domains/grid/types/grid.types';
import type { ValidateAnswerRequest } from '@/domains/grid/types/validate.answer';
import { dailyPuzzleRepository } from '../repositories/daily-puzzle.repository';
import { playerRepository } from '@/server/player/repositories/player.repository';
import { answerRepository } from '../repositories/answer.repository';

async function loadGrid(
  input: ValidateAnswerRequest,
  db: ReturnType<typeof createSupabase>
): Promise<Grid> {
  if (input.source === 'DAILY') {
    const { data, error } = await dailyPuzzleRepository.findById(
      input.puzzleId,
      db
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
    return data.grid_data;
  }

  const { data, error } = await ticTacToeRepository.findById(input.matchId, db);
  if (error) {
    throw new AppError(
      'Unable to load match',
      'MATCH_LOAD_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: error }
    );
  }
  if (!data) {
    throw new AppError(
      'Match not found',
      'MATCH_NOT_FOUND',
      AppErrorType.NOT_FOUND
    );
  }
  return data.grid;
}

async function validateAnswer(
  input: ValidateAnswerRequest,
  db: ReturnType<typeof createSupabase>
) {
  const grid = await loadGrid(input, db);
  return validateGridAnswer(grid, input, db);
}

async function validateGridAnswer(
  grid: Grid,
  input: Pick<ValidateAnswerRequest, 'row' | 'column' | 'playerId'>,
  db: ReturnType<typeof createSupabase>
) {
  const player = await playerRepository.findPlayer(input.playerId, db);
  if (player.error) {
    throw new AppError(
      'Unable to load player',
      'PLAYER_LOAD_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: player.error }
    );
  }
  if (!player.data) {
    throw new AppError(
      'Player not found',
      'PLAYER_NOT_FOUND',
      AppErrorType.NOT_FOUND
    );
  }
  const row = grid.rows[input.row];
  const column = grid.columns[input.column];
  const selected = player.data;

  async function matches(criterion: GridCategory): Promise<boolean> {
    switch (criterion.type) {
      case 'TEAM':
        return (
          !!criterion.referenceId &&
          !!selected.teams?.includes(criterion.referenceId)
        );
      case 'TEAMMATE': {
        if (!criterion.referenceId || criterion.referenceId === selected.id)
          return false;
        const result = await answerRepository.findTeammate(
          selected.id,
          criterion.referenceId,
          db
        );
        if (result.error) {
          throw new AppError(
            'Unable to check teammates',
            'TEAMMATE_LOOKUP_FAILED',
            AppErrorType.INTERNAL_SERVER_ERROR,
            { cause: result.error }
          );
        }
        return !!result.data;
      }
      case 'ACHIEVEMENT':
        if (criterion.id === 'ACHIEVEMENT:mvp-or-dpoy')
          return selected.mvp || selected.dpoy;
        if (criterion.id === 'ACHIEVEMENT:roy-or-mip')
          return selected.roy || selected.mip;
        break;
      case 'STAT':
        if (criterion.id === 'STAT:season-points:gte:2000')
          return selected.highest_season_points_total >= 2000;
        break;
    }
    throw new AppError(
      'Unsupported puzzle criterion',
      'UNSUPPORTED_PUZZLE_CRITERION',
      AppErrorType.INTERNAL_SERVER_ERROR
    );
  }

  const [matchesRow, matchesColumn] = await Promise.all([
    matches(row),
    matches(column),
  ]);
  const correct = matchesRow && matchesColumn;
  if (!correct || !selected.main_team) return { correct };
  const team = await teamRepository.findByCode(selected.main_team, db);
  if (team.error) {
    throw new AppError(
      'Unable to load team colors',
      'TEAM_COLORS_LOAD_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: team.error }
    );
  }
  return {
    correct,
    jerseyColor: team.data?.primary_color,
    trimColor: team.data?.secondary_color,
  };
}

export const answerService = { validateAnswer, validateGridAnswer };
