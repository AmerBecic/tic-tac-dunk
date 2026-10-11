import type { ApiResponse } from '@/server/types/api.types';
import type { DailyPuzzle } from './grid.types';

export type GetDailyPuzzleResponse = ApiResponse<DailyPuzzle | null>;
