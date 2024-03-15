import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { useMemo } from 'react';

let client: SupabaseClient<Database> | null = null;
let token: string | null = null;

const createSupabaseClient = (accessToken?: string | null) => {
  if (token !== accessToken) {
    token = accessToken || null;
    client = null;
  }

  if (client === null) {
    client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        ...(accessToken && {
          global: { headers: { Authorization: `Bearer ${accessToken}` } },
        }),
      }
    );
  }

  return client;
};

export const supabaseClient = (accessToken?: string | null) => {
  return useMemo(() => createSupabaseClient(accessToken), [accessToken]);
};
