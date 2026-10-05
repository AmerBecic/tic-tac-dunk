import type { ApiResponse } from '@/core/types/api.types';
import type { Match } from './match.types';

export type GetMatchesResponse = ApiResponse<Match[]>;
