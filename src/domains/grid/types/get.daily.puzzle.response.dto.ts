import type { ApiResponse } from '@/core/types/api.types';
import type { DailyPuzzle } from './grid.types';

export type GetDailyPuzzleResponse = ApiResponse<DailyPuzzle | null>;
