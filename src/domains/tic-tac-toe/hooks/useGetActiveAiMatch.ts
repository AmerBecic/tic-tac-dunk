'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GET_TIC_TAC_TOE_MATCHES_QUERY_KEY } from '@/core/constants/QueryKeys';
import { TicTacToeApi } from '../requests/TicTacToeApi';
import type { GetMatchesResponse } from '../types/get.matches.response.dto';
import type { Match } from '../types/match.types';
import type { GetMatchesRequest } from '../types/get.matches.request.dto';

const activeAiMatchFilters: GetMatchesRequest = {
  mode: 'AI',
  status: ['WAITING', 'ACTIVE'],
};

export const ACTIVE_AI_MATCH_QUERY_KEY = [
  GET_TIC_TAC_TOE_MATCHES_QUERY_KEY,
  activeAiMatchFilters,
] as const;

interface UseGetActiveAiMatchResult
  extends Omit<UseQueryResult<GetMatchesResponse, Error>, 'data'> {
  activeAiMatch: Match | null;
}

export const useGetActiveAiMatch = (): UseGetActiveAiMatchResult => {
  const { data, ...rest } = useQuery<GetMatchesResponse, Error>({
    queryKey: ACTIVE_AI_MATCH_QUERY_KEY,
    queryFn: () => TicTacToeApi.getMatches(activeAiMatchFilters),
  });

  return {
    activeAiMatch: data?.data?.[0] ?? null,
    ...rest,
  };
};
