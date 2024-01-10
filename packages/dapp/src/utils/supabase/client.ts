import { createClient as createSupbaseClient } from '@supabase/supabase-js';

import { Database } from './database.types';

export const createClient = (token: string) =>
  createSupbaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
