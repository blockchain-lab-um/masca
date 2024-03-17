import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const user = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!) as {
      sub: string;
      address: string;
      aud: string;
      role: string;
      iat: number;
      exp: number;
    };

    const supabase = supabaseServiceRoleClient();

    const { data, error } = await supabase
      .from('users')
      .select('id, campaign_requirements(id)')
      .eq('id', user.sub);

    if (error) {
      return new NextResponse('Internal Server Error', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    return NextResponse.json(
      {
        completed:
          !data || data.length === 0
            ? []
            : data[0].campaign_requirements.map((r) => r.id),
      },
      { status: 200 }
    );
  } catch (error) {
    if ((error as Error).message === 'jwt expired') {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    console.error(error);
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
