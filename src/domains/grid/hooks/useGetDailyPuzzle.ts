'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { GridApi } from '../requests/GridApi';
import { GET_DAILY_PUZZLE_QUERY_KEY } from '@/core/constants/QueryKeys';
import type { DailyPuzzle } from '../types/grid.types';

interface UseGetDailyPuzzleResult
  extends Omit<UseQueryResult<DailyPuzzle | null, Error>, 'data'> {
  dailyPuzzle: DailyPuzzle | null;
}

export const useGetDailyPuzzle = (): UseGetDailyPuzzleResult => {
  const fetchDailyPuzzle = async (): Promise<DailyPuzzle | null> => {
    return (await GridApi.getDailyPuzzle()) ?? null;
  };

  const { data, ...rest } = useQuery<DailyPuzzle | null, Error>({
    queryKey: [GET_DAILY_PUZZLE_QUERY_KEY],
    queryFn: fetchDailyPuzzle,
  });

  return {
    dailyPuzzle: data ?? null,
    ...rest,
  };
};
