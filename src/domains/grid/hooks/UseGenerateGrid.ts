'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { GridApi } from '../api/GridApi';
import { GENERATE_GRID_QUERY_KEY } from '@/core/constants/QueryKeys';
import { GenerateGridResponse } from '..';

type GeneratedGrid = NonNullable<GenerateGridResponse['data']> | null;

interface UseGenerateGridResult
  extends Omit<UseQueryResult<GeneratedGrid, Error>, 'data'> {
  grid: GeneratedGrid;
}

export const useGenerateGrid = (): UseGenerateGridResult => {
  const fetchGrid = async (): Promise<GeneratedGrid> => {
    return (await GridApi.generateGrid()) ?? null;
  };

  const { data, ...rest } = useQuery<GeneratedGrid, Error>({
    queryKey: [GENERATE_GRID_QUERY_KEY],
    queryFn: fetchGrid,
  });

  return {
    grid: data ?? null,
    ...rest,
  };
};
