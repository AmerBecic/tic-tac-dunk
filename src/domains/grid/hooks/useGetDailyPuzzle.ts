'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { GridApi } from '../requests/GridApi';
import { GET_DAILY_PUZZLE_QUERY_KEY } from '@/core/constants/QueryKeys';
import type { Grid } from '../types/grid.types';

interface UseGetDailyPuzzleResult
  extends Omit<UseQueryResult<Grid | null, Error>, 'data'> {
  dailyPuzzle: Grid | null;
}

export const useGetDailyPuzzle = (): UseGetDailyPuzzleResult => {
  const fetchDailyPuzzle = async (): Promise<Grid | null> => {
    return (await GridApi.getDailyPuzzle()) ?? null;
  };

  const { data, ...rest } = useQuery<Grid | null, Error>({
    queryKey: [GET_DAILY_PUZZLE_QUERY_KEY],
    queryFn: fetchDailyPuzzle,
  });

  return {
    dailyPuzzle: data ?? null,
    ...rest,
  };
};
