import { Api } from '@/core/api/Api';
import {
  CREATE_TIC_TAC_TOE_MATCH_API_URL,
  GET_TIC_TAC_TOE_MATCHES_API_URL,
} from '@/core/constants/ApiRoutes';
import type { GetMatchesRequest } from '../types/get.matches.request.dto';
import type { GetMatchesResponse } from '../types/get.matches.response.dto';
import type { CreateMatchRequest } from '../types/create.match.request.dto';
import type { CreateMatchResponse } from '../types/create.match.response.dto';

const createMatch = async (
  input: CreateMatchRequest
): Promise<CreateMatchResponse['data']> => {
  const response = await Api.post<CreateMatchResponse>(
    CREATE_TIC_TAC_TOE_MATCH_API_URL,
    input,
    'no-store'
  );

  return response.data;
};

const getMatches = async (
  filters: GetMatchesRequest = {}
): Promise<GetMatchesResponse> => {
  const params = new URLSearchParams();
  if (filters.mode) params.append('mode', filters.mode);
  for (const status of filters.status ?? []) params.append('status', status);

  return await Api.get<GetMatchesResponse>(
    `${GET_TIC_TAC_TOE_MATCHES_API_URL}?${params.toString()}`,
    'no-store'
  );
};

export const TicTacToeApi = { createMatch, getMatches };
