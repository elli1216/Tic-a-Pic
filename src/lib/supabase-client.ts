import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client using public environment variables
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);
