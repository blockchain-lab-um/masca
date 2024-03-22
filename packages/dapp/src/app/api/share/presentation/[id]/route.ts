import { type NextRequest, NextResponse } from 'next/server';

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
  try {
    const supabase = supabaseServiceRoleClient();

    const { data, error } = await supabase
      .from('presentations')
      .select()
      .eq('id', id)
      .limit(1)
      .single();

    if (error || !data) {
      return new NextResponse('Presentation not found', {
        status: 404,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    return NextResponse.json(
      {
        presentation: data.presentation,
      },
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
        },
      }
    );
  } catch (error) {
    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
    },
  });
}
