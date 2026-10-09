import type { GetMatchesRequest } from '@/domains/tic-tac-toe/types/get.matches.request.dto';
import type { GetMatchesResponse } from '@/domains/tic-tac-toe/types/get.matches.response.dto';
import 'server-only';
import type { createSupabase } from '@/core/supabase/server';
import {
  DEFAULT_GRID_CONFIG,
  GRID_SIZE,
} from '@/domains/grid/types/grid.constants';
import type { CreateMatchRequest } from '@/domains/tic-tac-toe/types/create.match.request.dto';
import type { CreateMatchResponse } from '@/domains/tic-tac-toe/types/create.match.response.dto';
import { gridService } from '@/server/grid/services/grid.service';
import { ticTacToeRepository } from '../repositories/tic-tac-toe.repository';

async function createMatch(
  request: CreateMatchRequest,
  player1Id: string,
  supabase: ReturnType<typeof createSupabase>
): Promise<CreateMatchResponse> {
  const generated = await gridService.generateAndValidate(
    DEFAULT_GRID_CONFIG,
    supabase
  );
  if (!generated.ok)
    throw new Error(`Unable to generate match grid: ${generated.message}`);
  const active = request.mode === 'AI';
  const { data, error } = await ticTacToeRepository.createMatch(
    {
      ...request,
      player1Id,
      player2Id: null,
      grid: generated.grid,
      board: Array.from({ length: GRID_SIZE * GRID_SIZE }, () => null),
      history: [],
      status: active ? 'ACTIVE' : 'WAITING',
      currentPlayer: active ? 'PLAYER1' : null,
      winner: null,
      endReason: null,
      turnNumber: active ? 1 : 0,
      turnEndsAt: active
        ? new Date(
            Date.now() + request.turnDurationSeconds * 1000
          ).toISOString()
        : null,
      version: 0,
      finishedAt: null,
    },
    supabase
  );
  if (error || !data)
    throw new Error(
      `Unable to create match: ${error?.message ?? 'No match returned.'}`
    );
  return { success: true, data };
}

async function getMatches(
  filters: GetMatchesRequest,
  playerId: string,
  supabase: ReturnType<typeof createSupabase>
): Promise<GetMatchesResponse> {
  const { data, error } = await ticTacToeRepository.getMatches(
    filters,
    playerId,
    supabase
  );
  if (error) throw new Error(`Unable to load matches: ${error.message}`);
  return { success: true, data };
}

export const ticTacToeService = { createMatch, getMatches };
