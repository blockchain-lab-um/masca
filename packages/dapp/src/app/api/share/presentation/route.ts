import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

import { Database } from '@/utils/supabase/database.types';
import { getAgent } from '../../veramoSetup';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request: NextRequest) {
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

    const { presentation } = await request.json();

    if (!presentation) {
      return new NextResponse('Missing presentation', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const agent = await getAgent();

    const { verified } = await agent.verifyPresentation({
      presentation,
    });

    if (!verified) {
      return new NextResponse('Presentation not valid', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { data, error } = await supabase
      .from('presentations')
      .insert({
        user_id: user.sub,
        presentation,
        created_at: new Date().toISOString(),
        title: 'Untitled',
      })
      .select()
      .limit(1)
      .single();

    if (error || !data) {
      return new NextResponse('Internal Server Error', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    return NextResponse.json(
      {
        presentationId: data.id,
      },
      {
        status: 201,
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
