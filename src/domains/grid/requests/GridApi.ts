import type {
  ValidateAnswerRequest,
  ValidateAnswerResponse,
} from '../types/ValidateAnswer';
import {
  GENERATE_GRID_API_URL,
  GET_DAILY_PUZZLE_API_URL,
  VALIDATE_ANSWER_API_URL,
} from '@/core/constants/ApiRoutes';
import type { GetDailyPuzzleResponse } from '../types/get.daily.puzzle.response.dto';
import { Api } from '@/core/api/Api';
import { GenerateGridResponse } from '..';

const generateGrid = async (): Promise<GenerateGridResponse['data']> => {
  const response = await Api.get<GenerateGridResponse>(
    GENERATE_GRID_API_URL,
    'no-store'
  );

  return response.data;
};

const getDailyPuzzle = async (): Promise<GetDailyPuzzleResponse['data']> => {
  const response = await Api.get<GetDailyPuzzleResponse>(
    GET_DAILY_PUZZLE_API_URL,
    'no-store'
  );
  return response.data;
};

const validateAnswer = async (input: ValidateAnswerRequest) => {
  const response = await Api.post<ValidateAnswerResponse>(
    VALIDATE_ANSWER_API_URL,
    input,
    'no-store'
  );
  return response.data;
};

export const GridApi = {
  validateAnswer,
  getDailyPuzzle,
  generateGrid,
};
