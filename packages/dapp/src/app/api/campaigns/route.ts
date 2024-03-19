import { NextRequest, NextResponse } from 'next/server';

import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest) {
  const supabase = supabaseServiceRoleClient();

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*, requirements(id, *)')
    .order('created_at', { ascending: false })
    .eq('production', true);

  if (error) {
    console.error('Error getting campaigns', error);
    return new NextResponse('Error getting campaigns', {
      status: 500,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }

  return NextResponse.json({ campaigns }, { headers: { ...CORS_HEADERS } });
}
