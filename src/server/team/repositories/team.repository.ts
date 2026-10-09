import type { PostgrestMaybeSingleResponse } from '@supabase/supabase-js';

import type { createSupabase } from '@/core/supabase/server';
import type { TeamRow } from '@/server/team/types/team.types';

type FindByCodeResult = PostgrestMaybeSingleResponse<
  Pick<TeamRow, 'primary_color' | 'secondary_color'>
>;

async function findByCode(
  code: string,
  db: ReturnType<typeof createSupabase>
): Promise<FindByCodeResult> {
  return await db
    .from('teams')
    .select('primary_color, secondary_color')
    .eq('code', code)
    .maybeSingle();
}

export const teamRepository = { findByCode };
