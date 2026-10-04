import type { Grid } from '@/domains/grid/types/grid.types';

export type Match = {
  id: string;
  mode: 'AI' | 'ONLINE';
  player1Id: string;
  player2Id: string | null;
  grid: Grid;
  board: Array<{
    owner: 'PLAYER1' | 'PLAYER2';
    nbaPlayerId: string;
    playerName: string;
    jerseyColor?: string;
    trimColor?: string;
  } | null>;
  history: [];
  status: 'WAITING' | 'ACTIVE' | 'FINISHED' | 'ABANDONED';
  currentPlayer: 'PLAYER1' | 'PLAYER2' | null;
  winner: 'PLAYER1' | 'PLAYER2' | null;
  endReason: 'THREE_IN_ROW' | 'DRAW' | 'FORFEIT' | null;
  turnNumber: number;
  turnDurationSeconds: number;
  turnEndsAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  finishedAt: string | null;
};
