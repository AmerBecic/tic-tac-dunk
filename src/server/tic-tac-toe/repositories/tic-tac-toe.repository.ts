import type {
  PostgrestMaybeSingleResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';
import type { GetMatchesRequest } from '@/domains/tic-tac-toe/types/get.matches.request.dto';
import 'server-only';
import type { createSupabase } from '@/core/supabase/server';
import type { Match } from '@/domains/tic-tac-toe/types/match.types';
import { mapMatch } from '@/server/tic-tac-toe/mappers/match.mapper';
import type { MatchRow } from '@/server/tic-tac-toe/types/match.types';

type CreateMatchResult = PostgrestSingleResponse<Match>;
type GetMatchesResult = PostgrestSingleResponse<Match[]>;
type FindByIdResult = PostgrestSingleResponse<
  Pick<MatchRow, 'id' | 'player1_id' | 'player2_id'> & { grid: Match['grid'] }
>;
type FindMatchByIdResult = PostgrestMaybeSingleResponse<Match>;
type SaveActionResult = PostgrestMaybeSingleResponse<Match>;

type NewMatch = Omit<Match, 'id' | 'createdAt' | 'updatedAt'>;

async function createMatch(
  match: NewMatch,
  supabase: ReturnType<typeof createSupabase>
): Promise<CreateMatchResult> {
  const result = await supabase
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
    .single();

  if (result.error) return result;
  return {
    ...result,
    data: {
      ...match,
      id: result.data.id,
      createdAt: result.data.created_at,
      updatedAt: result.data.updated_at,
    },
  };
}

async function getMatches(
  filters: GetMatchesRequest,
  playerId: string,
  supabase: ReturnType<typeof createSupabase>
): Promise<GetMatchesResult> {
  let query = supabase
    .from('matches')
    .select(
      'id, mode, player1_id, player2_id, grid, board, history, status, current_player, winner, end_reason, turn_number, turn_duration_seconds, turn_ends_at, version, created_at, updated_at, finished_at'
    )
    .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`);

  if (filters.mode) query = query.eq('mode', filters.mode);
  if (filters.status?.length) query = query.in('status', filters.status);

  const result = await query
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (result.error) return result;
  return { ...result, data: result.data.map(mapMatch) };
}

async function findById(
  id: string,
  supabase: ReturnType<typeof createSupabase>
): Promise<FindByIdResult> {
  const result = await supabase
    .from('matches')
    .select('id, grid, player1_id, player2_id')
    .eq('id', id)
    .single();
  if (result.error) return result;
  return {
    ...result,
    data: { ...result.data, grid: result.data.grid as Match['grid'] },
  };
}

async function findMatchById(
  id: string,
  supabase: ReturnType<typeof createSupabase>
): Promise<FindMatchByIdResult> {
  const result = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (result.error) return result;
  return { ...result, data: result.data ? mapMatch(result.data) : null };
}

async function saveAction(
  match: Match,
  expectedVersion: number,
  supabase: ReturnType<typeof createSupabase>,
  deadlineCheck: 'live' | 'expired' | null
): Promise<SaveActionResult> {
  const now = new Date().toISOString();
  let query = supabase
    .from('matches')
    .update({
      board: match.board,
      history: match.history,
      status: match.status,
      current_player: match.currentPlayer,
      winner: match.winner,
      end_reason: match.endReason,
      turn_number: match.turnNumber,
      turn_ends_at: match.turnEndsAt,
      finished_at: match.finishedAt,
      updated_at: now,
      version: expectedVersion + 1,
    })
    .eq('id', match.id)
    .eq('version', expectedVersion)
    .eq('status', 'ACTIVE');
  if (deadlineCheck === 'live') query = query.gt('turn_ends_at', now);
  if (deadlineCheck === 'expired') query = query.lte('turn_ends_at', now);
  const result = await query.select('*').maybeSingle();
  if (result.error) return result;
  return { ...result, data: result.data ? mapMatch(result.data) : null };
}

export const ticTacToeRepository = {
  createMatch,
  getMatches,
  findById,
  findMatchById,
  saveAction,
};
