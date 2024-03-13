// import { createClient as createSupbaseClient } from '@supabase/supabase-js';

// import { Database } from './database.types';

// export const createClient = (token: string) =>
//   createSupbaseClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       global: {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     }
//   );

import {
  createClient as createSupbaseClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Database } from './database.types';

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let cachedSupabaseClient: SupabaseClient<Database> | null = null;
let lastToken: string | null = null;

export const createClient = (supabaseAccessToken: string | null) => {
  if (supabaseAccessToken === null) {
    throw new Error('Missing access token');
  }
  if (supabaseAccessToken === lastToken && cachedSupabaseClient !== null) {
    return cachedSupabaseClient;
  }

  lastToken = supabaseAccessToken;

  const supabase = createSupbaseClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    }
  );

  cachedSupabaseClient = supabase;

  return supabase;
};
