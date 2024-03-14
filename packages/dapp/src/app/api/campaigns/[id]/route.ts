import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(
  _: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const supabase = supabaseServiceRoleClient();

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*, campaign_requirements (*)')
    .eq('id', id)
    .eq('production', true)
    .single();

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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
    },
  });
}
