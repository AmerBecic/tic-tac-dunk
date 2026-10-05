import type { GetMatchesRequest } from '@/domains/tic-tac-toe/types/get.matches.request.dto';
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

async function getMatches(
  filters: GetMatchesRequest,
  playerId: string,
  supabase: ReturnType<typeof createSupabase>
) {
  let query = supabase
    .from('matches')
    .select(
      'id, mode, player1_id, player2_id, grid, board, history, status, current_player, winner, end_reason, turn_number, turn_duration_seconds, turn_ends_at, version, created_at, updated_at, finished_at'
    )
    .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`);

  if (filters.mode) query = query.eq('mode', filters.mode);
  if (filters.status?.length) query = query.in('status', filters.status);

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  const matches: Match[] = (data ?? []).map((row) => ({
    id: row.id,
    mode: row.mode,
    player1Id: row.player1_id,
    player2Id: row.player2_id,
    grid: row.grid,
    board: row.board,
    history: row.history,
    status: row.status,
    currentPlayer: row.current_player,
    winner: row.winner,
    endReason: row.end_reason,
    turnNumber: row.turn_number,
    turnDurationSeconds: row.turn_duration_seconds,
    turnEndsAt: row.turn_ends_at,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    finishedAt: row.finished_at,
  }));
  return { data: matches, error };
}

export const ticTacToeRepository = { createMatch, getMatches };
