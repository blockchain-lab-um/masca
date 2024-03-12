import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { Database } from '@/utils/supabase/database.types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(_: NextRequest) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*, campaign_requirements(*)');
  // .eq('production', true);

  if (error) {
    return new NextResponse('Error getting campaigns', {
      status: 500,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }

  return NextResponse.json(campaigns, { headers: { ...CORS_HEADERS } });
}
