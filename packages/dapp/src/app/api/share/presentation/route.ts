import jwt from 'jsonwebtoken';
import { type NextRequest, NextResponse } from 'next/server';
import {
  type VerificationResult,
  VerificationService,
} from '@blockchain-lab-um/extended-verification';

import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';
import type { W3CVerifiablePresentation } from '@veramo/core';
import { isError, type Result } from '@blockchain-lab-um/masca-connector';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const dynamic = 'force-dynamic';

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

    const { presentation, title } = await request.json();

    if (!presentation) {
      return new NextResponse('Missing presentation', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (!title) {
      return new NextResponse('Missing title', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const isSdJwtPresentation =
      Array.isArray(presentation) &&
      Object.keys(presentation[0]).includes('_sd_alg');

    await VerificationService.init();

    // TODO: Implement sd-jwt verification
    const verifiedResult: Result<VerificationResult> = isSdJwtPresentation
      ? {
          success: true,
          data: {
            verified: true,
            details: {
              credentials: [],
              presentation: null,
            },
          },
        }
      : await VerificationService.verify(
          presentation as W3CVerifiablePresentation
        );

    if (isError(verifiedResult)) {
      return new NextResponse('Failed to verify presentation', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (!verifiedResult.data.verified) {
      return NextResponse.json(
        {
          message: 'Invalid presentation',
          details: verifiedResult.data.details,
        },
        {
          status: 400,
          headers: {
            ...CORS_HEADERS,
          },
        }
      );
    }

    const supabase = supabaseServiceRoleClient();

    const { data, error } = await supabase
      .from('presentations')
      .insert({
        user_id: user.sub,
        presentation,
        created_at: new Date().toISOString(),
        title,
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
