import 'server-only';
import type { createSupabase } from '@/core/supabase/server';
import type { Match } from '@/domains/tic-tac-toe/types/match.types';

type NewMatch = Omit<Match, 'id' | 'createdAt' | 'updatedAt'>;
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

async function getActiveAiGame(
  playerId: string,
  supabase: ReturnType<typeof createSupabase>
) {
  const { data, error } = await supabase
    .from('matches')
    .select(
      'id, player1_id, grid, board, history, status, current_player, turn_number, turn_duration_seconds, turn_ends_at, version, created_at, updated_at'
    )
    .eq('player1_id', playerId)
    .eq('mode', 'AI')
    .in('status', ['WAITING', 'ACTIVE'])
    .maybeSingle();

  const game: Match | null = data
    ? {
        id: data.id,
        mode: 'AI',
        player1Id: data.player1_id,
        player2Id: null,
        grid: data.grid,
        board: data.board,
        history: data.history,
        status: data.status,
        currentPlayer: data.current_player,
        winner: null,
        endReason: null,
        turnNumber: data.turn_number,
        turnDurationSeconds: data.turn_duration_seconds,
        turnEndsAt: data.turn_ends_at,
        version: data.version,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        finishedAt: null,
      }
    : null;
  return { data: game, error };
}

export const ticTacToeRepository = { createMatch, getActiveAiGame };
