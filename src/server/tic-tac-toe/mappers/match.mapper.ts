import type { Match } from '@/domains/tic-tac-toe/types/match.types';
import type { MatchRow } from '@/server/tic-tac-toe/types/match.types';

export function mapMatch(row: MatchRow): Match {
  return {
    id: row.id,
    mode: row.mode,
    player1Id: row.player1_id,
    player2Id: row.player2_id,
    grid: row.grid as Match['grid'],
    board: row.board as Match['board'],
    history: row.history as Match['history'],
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
  };
}
