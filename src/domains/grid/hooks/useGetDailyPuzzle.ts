'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { GridApi } from '../requests/GridApi';
import { GET_DAILY_PUZZLE_QUERY_KEY } from '@/core/constants/QueryKeys';
import type { DailyPuzzle } from '../types/grid.types';
import type { GetDailyPuzzleRequest } from '../types/get.daily.puzzle.request.dto';

interface UseGetDailyPuzzleResult
  extends Omit<UseQueryResult<DailyPuzzle | null, Error>, 'data'> {
  dailyPuzzle: DailyPuzzle | null;
}

export const useGetDailyPuzzle = ({
  date,
}: GetDailyPuzzleRequest): UseGetDailyPuzzleResult => {
  const fetchDailyPuzzle = async (): Promise<DailyPuzzle | null> => {
    return (await GridApi.getDailyPuzzle({ date })) ?? null;
  };

  const { data, ...rest } = useQuery<DailyPuzzle | null, Error>({
    queryKey: [GET_DAILY_PUZZLE_QUERY_KEY, date],
    queryFn: fetchDailyPuzzle,
  });

  return {
    dailyPuzzle: data ?? null,
    ...rest,
  };
};
