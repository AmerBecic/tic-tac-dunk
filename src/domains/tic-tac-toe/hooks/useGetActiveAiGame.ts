'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GET_ACTIVE_AI_GAME_QUERY_KEY } from '@/core/constants/QueryKeys';
import { TicTacToeApi } from '../requests/TicTacToeApi';
import type { GetActiveAiGameResponse } from '../types/get.active.ai.game.response.dto';
import type { Match } from '../types/match.types';

interface UseGetActiveAiGameResult
  extends Omit<UseQueryResult<GetActiveAiGameResponse, Error>, 'data'> {
  activeAiGame: Match | null;
}

export const useGetActiveAiGame = (): UseGetActiveAiGameResult => {
  const { data, ...rest } = useQuery<GetActiveAiGameResponse, Error>({
    queryKey: [GET_ACTIVE_AI_GAME_QUERY_KEY],
    queryFn: () => TicTacToeApi.getActiveAiGame(),
  });

  return {
    activeAiGame: data?.data ?? null,
    ...rest,
  };
};
