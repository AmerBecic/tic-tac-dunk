import type { Match } from './match.types';

export type MatchActionResponse =
  | { success: true; data: Match; correct?: boolean }
  | {
      success: false;
      error: string;
      code:
        | 'INVALID_ACTION'
        | 'NOT_FOUND'
        | 'CONFLICT'
        | 'UNAUTHORIZED'
        | 'INTERNAL_ERROR';
    };
