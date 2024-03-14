import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';

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

    const supabase = supabaseServiceRoleClient();

    const { data: selectData, error: selectError } = await supabase
      .from('encrypted_sessions')
      .select('id')
      .eq('user_id', user.sub);

    if (selectError) {
      return new NextResponse('Internal Server Error', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    // If session is found delete it
    if (selectData.length !== 0) {
      const { error: deleteError } = await supabase
        .from('encrypted_sessions')
        .delete()
        .eq('user_id', user.sub);

      if (deleteError) {
        return new NextResponse('Internal Server Error', {
          status: 500,
          headers: {
            ...CORS_HEADERS,
          },
        });
      }
    }

    // Create a new session
    const { data: insertData, error: insertError } = await supabase
      .from('encrypted_sessions')
      .insert({
        user_id: user.sub,
      })
      .select()
      .limit(1)
      .single();

    if (insertError || !insertData) {
      return new NextResponse('Internal Server Error', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    return NextResponse.json(
      {
        sessionId: insertData.id,
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
