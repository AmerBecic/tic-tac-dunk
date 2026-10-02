import type { createSupabase } from '@/core/supabase/server';

async function findByCode(code: string, db: ReturnType<typeof createSupabase>) {
  const { data, error } = await db
    .from('teams')
    .select('primary_color, secondary_color')
    .eq('code', code)
    .maybeSingle();
  return {
    data: data as { primary_color: string; secondary_color: string } | null,
    error,
  };
}

export const teamRepository = { findByCode };
