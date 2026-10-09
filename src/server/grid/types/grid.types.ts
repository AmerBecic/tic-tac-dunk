import type { Database } from '@/core/supabase/DatabaseTypes';

export type DailyPuzzleRow =
  Database['public']['Tables']['daily_puzzles']['Row'];
export type DailyPuzzleInsert =
  Database['public']['Tables']['daily_puzzles']['Insert'];
export type DailyPuzzleUpdate =
  Database['public']['Tables']['daily_puzzles']['Update'];
