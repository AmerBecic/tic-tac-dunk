import type { createSupabase } from '@/core/supabase/server';
import type { SearchPlayersRequest } from '@/domains/player/types/search.player.request.dto';
import type { SearchPlayersResponse } from '@/domains/player/types/search.player.response.dto';
import { playerRepository } from '../repositories/player.repository';

async function searchPlayers(
  { search = '', page = 1, limit = 20 }: SearchPlayersRequest,
  supabase: ReturnType<typeof createSupabase>
): Promise<SearchPlayersResponse> {
  const offset = (page - 1) * limit;
  const result = await playerRepository.searchPlayers(
    search,
    offset,
    limit,
    supabase
  );
  if (result.error) {
    throw new Error(`Unable to search players: ${result.error.message}`);
  }

  let total = result.total;
  if (result.data.length === 0 && offset > 0) {
    const firstPage = await playerRepository.searchPlayers(
      search,
      0,
      1,
      supabase
    );
    if (firstPage.error)
      throw new Error(`Unable to count players: ${firstPage.error.message}`);
    total = firstPage.total;
  }
  const totalPages = Math.ceil(total / limit);
  const hasPrevPage = page > 1 && totalPages > 0;
  const hasNextPage = page < totalPages;

  const response: SearchPlayersResponse = {
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

export const playerService = { searchPlayers };
