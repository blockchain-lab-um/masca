import { NextRequest, NextResponse } from 'next/server';

import { createPublicClient } from '@/utils/supabase/publicClient';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(_: NextRequest) {
  const supabase = createPublicClient();

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*, campaign_requirements(*)');
  // TODO add filter for production
  // .eq('production', true);
  console.log('󰊠 ~ file: route.ts:17 ~ GET ~ campaigns:', campaigns);

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
