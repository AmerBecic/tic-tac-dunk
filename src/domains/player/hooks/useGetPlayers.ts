'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Player } from '../types/player.types';
import type { GetPlayersRequest } from '../types/get.players.request.dto';
import type { GetPlayersResponse } from '../types/get.players.response.dto';
import { PlayerApi } from '../requests/PlayerApi';
import { SEARCH_PLAYERS_QUERY_KEY } from '@/core/constants/QueryKeys';

interface UseGetPlayersResult
  extends Omit<UseQueryResult<GetPlayersResponse, Error>, 'data'> {
  players: Player[];
  pagination: GetPlayersResponse['pagination'];
}

export const useGetPlayers = ({
  search = '',
  page = 1,
  limit = 20,
}: GetPlayersRequest = {}): UseGetPlayersResult => {
  const params = { search, page, limit };
  const { data, ...rest } = useQuery<GetPlayersResponse, Error>({
    queryKey: [SEARCH_PLAYERS_QUERY_KEY, params],
    queryFn: () => PlayerApi.getPlayers(params),
  });

  return {
    players: data?.data?.players ?? [],
    pagination: data?.pagination,
    ...rest,
  };
};
