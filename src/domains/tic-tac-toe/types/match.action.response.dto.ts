import type { Match } from './match.types';
import type { ApiErrorResponse } from '@/server/types/api-error-response.types';

export type MatchActionResponse =
  | { success: true; data: Match; correct?: boolean }
  | ApiErrorResponse;
