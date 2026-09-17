import { Api } from '@/domains/Api';
import { GENERATE_GRID_API_URL } from '@/core/constants/ApiRoutes';
import type { GenerateGridResponse } from '../types/GenerateGridResponseDTO';

const generateGrid = async (): Promise<GenerateGridResponse['data']> => {
  const response = await Api.get<GenerateGridResponse>(
    GENERATE_GRID_API_URL,
    'no-store'
  );

  return response.data;
};

export const GridApi = {
  generateGrid,
};
