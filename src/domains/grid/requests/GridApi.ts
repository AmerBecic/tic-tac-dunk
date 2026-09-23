import { GET_DAILY_PUZZLE_API_URL } from '@/core/constants/ApiRoutes';
import type { GetDailyPuzzleResponse } from '../types/GetDailyPuzzleResponseDTO';
import { Api } from '@/core/api/Api';
import { GENERATE_GRID_API_URL } from '@/core/constants/ApiRoutes';
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

export const GridApi = {
  getDailyPuzzle,
  generateGrid,
};
