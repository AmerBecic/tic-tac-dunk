/* Grid APIs */
export const GENERATE_GRID_API_URL = 'v1/grid/generate';
export const GET_DAILY_PUZZLE_API_URL = (date: string) =>
  `v1/grid/daily-puzzle/${encodeURIComponent(date)}`;
export const VALIDATE_ANSWER_API_URL = 'v1/grid/validate-answer';

/* Player APIs */
export const SEARCH_PLAYERS_API_URL = 'v1/players';
