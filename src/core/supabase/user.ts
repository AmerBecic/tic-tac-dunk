import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { isAuthSessionMissingError } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/core/constants/Env';

async function createSessionClient() {
  const cookieStore = await cookies();
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });

  return supabase;
}

export async function getSupabaseUser() {
  const supabase = await createSessionClient();
  return supabase.auth.getUser();
}

export async function getOrCreateSupabaseGuestUser() {
  const supabase = await createSessionClient();
  const result = await supabase.auth.getUser();

  if (result.data.user) return result;
  if (result.error && !isAuthSessionMissingError(result.error)) return result;

  const { data, error } = await supabase.auth.signInAnonymously();
  return { data: { user: data.user }, error };
}
