import type { Database } from '@/server/types/database.types';

export type PlayerRow = Database['public']['Tables']['players']['Row'];
export type PlayerInsert = Database['public']['Tables']['players']['Insert'];
export type PlayerUpdate = Database['public']['Tables']['players']['Update'];

export type PlayerTeammateRow =
  Database['public']['Tables']['player_teammates']['Row'];
export type PlayerTeammateInsert =
  Database['public']['Tables']['player_teammates']['Insert'];
export type PlayerTeammateUpdate =
  Database['public']['Tables']['player_teammates']['Update'];

/* Player RPC result types */

export type SearchPlayerRPC =
  Database['public']['Functions']['search_players']['Returns'][number];
