import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { createPublicClient } from '@/utils/supabase/publicClient';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET OPTIONS',
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

    const supabase = createPublicClient();

    const { data: requirements, error: requirementsError } = await supabase
      .from('requirement_user_rel')
      .select('campaign_requirements(*)')
      .eq('user_id', user.sub);

    if (requirementsError) {
      return new NextResponse('Internal Server Error', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    return NextResponse.json(
      {
        completed: requirements.map((requirement) => ({
          id: requirement.campaign_requirements?.id,
          completed_at: requirement.campaign_requirements?.created_at,
        })),
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
