import 'server-only';

import { createAdminClient } from '@supabase/server/core';

import { SUPABASE_URL } from '@/core/constants/Env';
import { SUPABASE_SECRET_KEY } from '@/core/constants/EnvServer';

export function createSupabase() {
  return createAdminClient({
    env: {
      url: SUPABASE_URL,
      secretKeys: { default: SUPABASE_SECRET_KEY },
    },
  });
}
