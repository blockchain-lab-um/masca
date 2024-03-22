import jwt from 'jsonwebtoken';
import { type NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type Authorization',
};

export async function GET(request: NextRequest) {
  try {
    // Get token from header
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const token = authorization.replace('Bearer ', '');

    // Verify token
    jwt.verify(token, process.env.SUPABASE_JWT_SECRET!);

    // Return without content
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error(error);
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
