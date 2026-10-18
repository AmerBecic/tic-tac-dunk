import type { createSupabase } from '@/core/supabase/server';
import type { GetPlayersRequest } from '@/domains/player/types/get.players.request.dto';
import type { GetPlayersResponse } from '@/domains/player/types/get.players.response.dto';
import { playerRepository } from '../repositories/player.repository';
import { AppError } from '@/server/errors/app.error';
import { AppErrorType } from '@/server/types/app-error.types';

async function getPlayers(
  { search = '', page = 1, limit = 20 }: GetPlayersRequest,
  supabase: ReturnType<typeof createSupabase>
): Promise<GetPlayersResponse> {
  const offset = (page - 1) * limit;
  const result = await playerRepository.getPlayers(
    search,
    offset,
    limit,
    supabase
  );
  if (result.error) {
    throw new AppError(
      'Unable to search players',
      'PLAYER_SEARCH_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: result.error }
    );
  }

  let total = result.total;
  if (result.data.length === 0 && offset > 0) {
    const firstPage = await playerRepository.getPlayers(search, 0, 1, supabase);
    if (firstPage.error) {
      throw new AppError(
        'Unable to count players',
        'PLAYER_COUNT_FAILED',
        AppErrorType.INTERNAL_SERVER_ERROR,
        { cause: firstPage.error }
      );
    }
    total = firstPage.total;
  }
  const totalPages = Math.ceil(total / limit);
  const hasPrevPage = page > 1 && totalPages > 0;
  const hasNextPage = page < totalPages;

  const response: GetPlayersResponse = {
    success: true,
    data: { players: result.data },
    pagination: {
      page,
      limit,
      total,
      total_pages: totalPages,
      paging_counter: result.data.length ? offset + 1 : 0,
      has_prev_page: hasPrevPage,
      has_next_page: hasNextPage,
      prev_page: hasPrevPage ? Math.min(page - 1, totalPages) : null,
      next_page: hasNextPage ? page + 1 : null,
    },
  };

  return response;
}

export const playerService = { getPlayers };
