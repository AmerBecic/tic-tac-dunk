import type { ApiResponse } from '@/core/types/api.types';
import type { Grid } from './GridTypes';

export type GetDailyPuzzleResponse = ApiResponse<Grid | null>;
