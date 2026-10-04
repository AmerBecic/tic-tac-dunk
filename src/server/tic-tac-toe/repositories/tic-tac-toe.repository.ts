import 'server-only';
import type { createSupabase } from '@/core/supabase/server';
import type { CreatedMatch } from '@/domains/tic-tac-toe/types/create.match.response.dto';

type NewMatch = Omit<CreatedMatch, 'id' | 'createdAt' | 'updatedAt'>;
type CreatedRow = { id: string; created_at: string; updated_at: string };

async function createMatch(
  match: NewMatch,
  supabase: ReturnType<typeof createSupabase>
) {
  const { data, error } = await supabase
    .from('matches')
    .insert({
      mode: match.mode,
      player1_id: match.player1Id,
      player2_id: match.player2Id,
      grid: match.grid,
      board: match.board,
      history: match.history,
      status: match.status,
      current_player: match.currentPlayer,
      winner: match.winner,
      end_reason: match.endReason,
      turn_number: match.turnNumber,
      turn_duration_seconds: match.turnDurationSeconds,
      turn_ends_at: match.turnEndsAt,
      version: match.version,
      finished_at: match.finishedAt,
    })
    .select('id, created_at, updated_at')
    .single<CreatedRow>();

  return {
    data: data
      ? {
          ...match,
          id: data.id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      : null,
    error,
  };
}

export const ticTacToeRepository = { createMatch };
