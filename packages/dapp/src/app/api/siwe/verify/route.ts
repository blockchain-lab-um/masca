import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';

import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request: NextRequest) {
  try {
    // Get session id from cookie
    const sessionId = request.cookies.get('verify.session')?.value;

    if (!sessionId) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const supabase = supabaseServiceRoleClient();

    const { data: authorizationQueryData } = await supabase
      .from('authorization')
      .select()
      .eq('id', sessionId)
      .limit(1);

    if (!authorizationQueryData || authorizationQueryData.length === 0) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const [authorizationData] = authorizationQueryData;

    // Check if expired
    if (new Date(authorizationData.expires_at) < new Date()) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const { message, signature } = await request.json();

    if (!message || !signature) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const siweObject = new SiweMessage(message);

    const { data } = await siweObject.verify({
      signature,
      nonce: authorizationData.nonce.replaceAll('-', ''),
    });

    const { address } = data;

    let userData;

    // Find user by address
    const { data: userQueryData, error: userQueryError } = await supabase
      .from('users')
      .select()
      .eq('address', address.toLowerCase())
      .limit(1);

    if (userQueryError) {
      return new NextResponse('Failed to query user by address', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    // If user does not exist, create a new one
    if (!userQueryData || userQueryData.length === 0) {
      const { data: userCreateData, error: userCreateError } = await supabase
        .from('users')
        .insert({
          address: address.toLowerCase(),
        })
        .select()
        .limit(1)
        .single();

      if (userCreateError || !userCreateData) {
        return new NextResponse('Failed to create user', {
          status: 500,
          headers: {
            ...CORS_HEADERS,
          },
        });
      }

      userData = userCreateData;
    } else {
      [userData] = userQueryData;
    }

    // Create a access token
    const token = jwt.sign(
      {
        sub: userData.id,
        address,
        // Neded for Supabase
        aud: 'authenticated',
        role: 'authenticated',
      },
      process.env.SUPABASE_JWT_SECRET!,
      {
        expiresIn: '12h',
      }
    );

    // Return response and set cookie
    return NextResponse.json(
      {
        jwt: token,
      },
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
        },
      }
    );
  } catch (error) {
    return new NextResponse('An unexpected error occurred.', {
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
