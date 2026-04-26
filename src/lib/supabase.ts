import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Server-side only — uses service role key (bypasses RLS for API routes)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
