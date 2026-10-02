import { teamRepository } from '@/server/team/repositories/team.repository';
import type { createSupabase } from '@/core/supabase/server';
import type { Grid, GridCategory } from '@/domains/grid/types/grid.types';
import type { ValidateAnswerRequest } from '@/domains/grid/types/ValidateAnswer';
import { dailyPuzzleRepository } from '../repositories/daily-puzzle.repository';
import { playerRepository } from '@/server/player/repositories/player.repository';
import { answerRepository } from '../repositories/answer.repository';

async function validateAnswer(
  input: ValidateAnswerRequest,
  db: ReturnType<typeof createSupabase>
) {
  const [puzzle, player] = await Promise.all([
    dailyPuzzleRepository.findById(input.puzzleId, db),
    playerRepository.findPlayer(input.playerId, db),
  ]);
  if (puzzle.error || player.error)
    throw new Error('Unable to load answer data');
  if (!puzzle.data || !player.data) return null;
  const grid = puzzle.data.grid_data as Grid;
  const row = grid.rows[input.row];
  const column = grid.columns[input.column];
  if (!row || !column) throw new Error('Invalid stored puzzle');
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
        if (result.error) throw new Error('Unable to check teammates');
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
    throw new Error('Unsupported puzzle criterion');
  }

  const [matchesRow, matchesColumn] = await Promise.all([
    matches(row),
    matches(column),
  ]);
  const correct = matchesRow && matchesColumn;
  if (!correct || !selected.main_team) return { correct };
  const team = await teamRepository.findByCode(selected.main_team, db);
  if (team.error) throw new Error('Unable to load team colors');
  return {
    correct,
    jerseyColor: team.data?.primary_color,
    trimColor: team.data?.secondary_color,
  };
}

export const answerService = { validateAnswer };
