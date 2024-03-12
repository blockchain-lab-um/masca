import { createClient } from '@supabase/supabase-js';
import { add, format } from 'date-fns';
import { NextResponse } from 'next/server';

import { Database } from '@/utils/supabase/database.types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  // Insert a new nonce and select 1 row
  const { data, error } = await supabase
    .from('authorization')
    .insert({
      // Expires in 5 minutes (ISO String)
      expires_at: format(
        add(new Date(), { minutes: 5 }),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
    })
    .select()
    .limit(1)
    .single();

  if (error || !data) {
    return new NextResponse('Internal server error', {
      status: 500,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }

  return NextResponse.json(
    {
      nonce: data.nonce,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
    },
    {
      headers: {
        ...CORS_HEADERS,
        'Set-Cookie': `verify.session=${data.id}; Path=/; HttpOnly; Secure; SameSite=Strict;`,
      },
      status: 200,
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
    },
  });
}
