import type { ApiResponse } from '@/core/types/api.types';
import type { Grid } from './grid.types';

export type GetDailyPuzzleResponse = ApiResponse<Grid | null>;
