import {
  createClient as createSupbaseClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Database } from './database.types';

let client: SupabaseClient<Database> | null = null;

export const supabaseServiceRoleClient = () => {
  if (!client) {
    client = createSupbaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );
  }

  return client;
};
