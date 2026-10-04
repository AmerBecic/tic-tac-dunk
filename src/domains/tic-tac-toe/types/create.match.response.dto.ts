import type { ApiResponse } from '@/core/types/api.types';
import type { Grid } from '@/domains/grid/types/grid.types';
import type { CreateMatchRequest } from './create.match.request.dto';

export type CreatedMatch = CreateMatchRequest & {
  id: string;
  player1Id: string;
  player2Id: null;
  grid: Grid;
  board: null[];
  history: [];
  status: 'ACTIVE' | 'WAITING';
  currentPlayer: 'PLAYER1' | null;
  winner: null;
  endReason: null;
  turnNumber: number;
  turnEndsAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  finishedAt: null;
};

export type CreateMatchResponse = ApiResponse<CreatedMatch>;
