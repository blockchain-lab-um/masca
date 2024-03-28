import { type NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';
import { supabaseClient } from '@/utils/supabase/supabaseClient';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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
  const { data: userId } = await supabase
    .from('users')
    .select('id')
    .eq('address', user.address.toLowerCase())
    .single();
  if (!userId) {
    return NextResponse.json({ claims: [] }, { headers: { ...CORS_HEADERS } });
  }
  const { data: claims, error } = await supabase
    .from('claims')
    .select('*')
    .eq('user_id', userId.id);

  if (error) {
    console.error('Error getting claims', error);
    return new NextResponse('Error getting claims', {
      status: 500,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }

  return NextResponse.json({ claims }, { headers: { ...CORS_HEADERS } });
}
