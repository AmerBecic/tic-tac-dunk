import { Api } from '@/core/api/Api';
import type { GetPlayersResponse } from '../types/get.players.response.dto';
import type { GetPlayersRequest } from '../types/get.players.request.dto';
import { SEARCH_PLAYERS_API_URL } from '@/core/constants/ApiRoutes';

const getPlayers = async ({
  search = '',
  page = 1,
  limit = 20,
}: GetPlayersRequest = {}): Promise<GetPlayersResponse> => {
  const params = new URLSearchParams({
    search,
    page: String(page),
    limit: String(limit),
  });
  return Api.get<GetPlayersResponse>(
    `${SEARCH_PLAYERS_API_URL}?${params.toString()}`,
    'no-store'
  );
};

export const PlayerApi = {
  getPlayers,
};
