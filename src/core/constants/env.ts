export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || '';

export const BASE_API_URL = process.env.API_BASE_PATH?.trim() || '';
