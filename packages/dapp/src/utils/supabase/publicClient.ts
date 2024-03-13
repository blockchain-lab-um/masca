import {
  createClient as createSupbaseClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Database } from './database.types';

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY: string = process.env.SUPABASE_SECRET_KEY!;

let cachedSupabaseClient: SupabaseClient<Database> | null = null;

export const createPublicClient = () => {
  if (cachedSupabaseClient !== null) {
    return cachedSupabaseClient;
  }

  const supabase = createSupbaseClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  cachedSupabaseClient = supabase;

  return supabase;
};
