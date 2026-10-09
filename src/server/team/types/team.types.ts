import type { Database } from '@/core/supabase/DatabaseTypes';

export type TeamRow = Database['public']['Tables']['teams']['Row'];
export type TeamInsert = Database['public']['Tables']['teams']['Insert'];
export type TeamUpdate = Database['public']['Tables']['teams']['Update'];
