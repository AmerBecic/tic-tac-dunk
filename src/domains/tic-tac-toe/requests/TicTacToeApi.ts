import { Api } from '@/core/api/Api';
import {
  CREATE_TIC_TAC_TOE_MATCH_API_URL,
  GET_ACTIVE_AI_GAME_API_URL,
} from '@/core/constants/ApiRoutes';
import type { GetActiveAiGameResponse } from '../types/get.active.ai.game.response.dto';
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

const getActiveAiGame = async (): Promise<GetActiveAiGameResponse> => {
  return await Api.get<GetActiveAiGameResponse>(
    GET_ACTIVE_AI_GAME_API_URL,
    'no-store'
  );
};

export const TicTacToeApi = { createMatch, getActiveAiGame };
