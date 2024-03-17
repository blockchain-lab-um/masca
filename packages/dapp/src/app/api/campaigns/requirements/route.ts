import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(_: NextRequest) {
  const supabase = supabaseServiceRoleClient();

  // TODO - get only requirements that are in the requirement_campaign_rel with prod on table
  const { data: requirements, error } = await supabase
    .from('campaign_requirements')
    .select('*');

  if (error) {
    return new NextResponse('Error getting requirements', {
      status: 500,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }

  return NextResponse.json({ requirements }, { headers: { ...CORS_HEADERS } });
}
