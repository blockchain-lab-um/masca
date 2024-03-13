import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET() {
  try {
    const token = jwt.sign(
      {
        sub: '97cb2533-1473-4a02-8bfe-537f16435db5',
        address: '0xc48199cc05054665B1991D36f0091A89b668C2C4',
        // Neded for Supabase
        aud: 'authenticated',
        role: 'authenticated',
      },
      process.env.SUPABASE_JWT_SECRET!,
      {
        expiresIn: '-1h',
      }
    );

    return NextResponse.json(token, {
      status: 200,
    });
  } catch (error) {
    console.log('Error', error);
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
