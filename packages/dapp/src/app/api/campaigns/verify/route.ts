import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiablePresentation,
} from '@veramo/core';
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

    let {
      presentation,
      // eslint-disable-next-line prefer-const
      did,
      // eslint-disable-next-line prefer-const
      campaignId,
    }: {
      presentation: W3CVerifiablePresentation;
      did: string;
      campaignId: string;
    } = await request.json();

    if (!presentation) {
      return new NextResponse('Missing presentation', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (!did) {
      return new NextResponse('Missing title', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (!campaignId) {
      return new NextResponse('Missing campaignId', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const agent = await getAgent();
    const didResolution = await agent.resolveDid({ didUrl: did });

    if (
      !didResolution.didDocument ||
      !didResolution.didDocument.verificationMethod
    ) {
      return new NextResponse('Error resolving did', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (
      didResolution.didDocument.verificationMethod[0].publicKeyHex !==
      user.address
    ) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select(`*, campaign_requirements (*)`)
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return new NextResponse('Error getting campaign', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const { data: requirements, error: requirementsError } = await supabase
      .from('campaign_requirements')
      .select('*')
      .eq('campaign_id', campaignId);

    if (requirementsError) {
      return new NextResponse('Error getting requirements', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (typeof presentation === 'string') {
      const decoded = jwt.decode(presentation);

      if (typeof decoded === 'string') {
        return new NextResponse('Invalid presentation', {
          status: 400,
          headers: {
            ...CORS_HEADERS,
          },
        });
      }

      presentation = decoded as VerifiablePresentation;
    }

    if (!presentation.verifiableCredential) {
      return new NextResponse('No credentials in presentation', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const credentials = presentation.verifiableCredential;

    const canClaim = requirements.every((requirement) =>
      credentials.some((credential) => {
        let cred: VerifiableCredential;
        if (typeof credential === 'string') {
          const decoded = jwt.decode(credential);

          if (typeof decoded === 'string') return false;

          cred = decoded as VerifiableCredential;
        } else cred = credential;
        if (cred.credentialSubject.issuer !== requirement.issuer) return false;
        if (!cred.type) return false;
        const credTypes =
          typeof cred.type === 'string' ? [cred.type] : cred.type;

        return requirement.types?.every((type) => credTypes.includes(type));
      })
    );

    if (!canClaim) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 200,
          headers: {
            ...CORS_HEADERS,
          },
        }
      );
    }

    const { data: claim, error: claimError } = await supabase
      .from('campaign_claims')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('user_id', user.sub)
      .single();

    if (claimError) {
      return new NextResponse('Error getting claim', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (!claim) {
      const { data: newClaim, error: newClaimError } = await supabase
        .from('campaign_claims')
        .insert([{ campaign_id: campaignId, user_id: user.sub, presentation }])
        .single();

      if (newClaimError || !newClaim) {
        return new NextResponse('Error creating claim', {
          status: 500,
          headers: {
            ...CORS_HEADERS,
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
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
