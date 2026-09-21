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

export const GridApi = {
  generateGrid,
};
