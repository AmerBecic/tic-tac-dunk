import type { Match } from './match.types';

export type GetMatchesRequest = {
  mode?: Match['mode'];
  status?: Match['status'][];
};
