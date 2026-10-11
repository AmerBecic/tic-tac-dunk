import type { Database } from '@/server/types/database.types';

/* Daily puzzle table types */

export type DailyPuzzleRow =
  Database['public']['Tables']['daily_puzzles']['Row'];
export type DailyPuzzleInsert =
  Database['public']['Tables']['daily_puzzles']['Insert'];
export type DailyPuzzleUpdate =
  Database['public']['Tables']['daily_puzzles']['Update'];

/* Grid RPC result types */

export type RandomTeamRPC =
  Database['public']['Functions']['get_random_teams']['Returns'][number];

export type EligiblePlayerRPC =
  Database['public']['Functions']['get_random_eligible_players']['Returns'][number];

// The SQL lookup returns null when a cell has no matching player.
export type GridAnswerRPC = Omit<
  Database['public']['Functions']['find_grid_answers']['Returns'][number],
  'player_id'
> & { player_id: string | null };

export type GridValidationRPC =
  Database['public']['Functions']['validate_grid']['Returns'][number];
