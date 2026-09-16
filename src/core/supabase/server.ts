import 'server-only';

import { createAdminClient } from '@supabase/server/core';

import { SUPABASE_URL } from '@/core/constants/env';
import { SUPABASE_SECRET_KEY } from '@/core/constants/env.server';

export function createSupabase() {
  return createAdminClient({
    env: {
      url: SUPABASE_URL,
      secretKeys: { default: SUPABASE_SECRET_KEY },
    },
  });
}
