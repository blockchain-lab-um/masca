import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MinimalImportableKey } from '@veramo/core';
import jwt from 'jsonwebtoken';

import { Database } from '@/utils/supabase/database.types';
import { getAgent } from '../../veramoSetup';

const PRIVATE_KEY = process.env.CAMPAIGN_PRIVATE_KEY;
const ISSUER = process.env.CAMPAIGN_ISSUER_DID;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request: NextRequest) {
  try {
    if (!PRIVATE_KEY || !ISSUER) {
      return new NextResponse('Internal Server Error', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

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

    const { did, campaignId } = await request.json();

    if (!did) {
      return new NextResponse('Missing reciever did', {
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
    const controllerKeyId = 'key-1';
    const method = 'did:pkh';
    const issuerDid = await agent.didManagerImport({
      did: ISSUER,
      provider: method,
      controllerKeyId,
      keys: [
        {
          kid: controllerKeyId,
          type: 'Secp256k1',
          kms: 'local',
          privateKeyHex: PRIVATE_KEY,
        } as MinimalImportableKey,
      ],
    });
    const vc = await agent.createVerifiableCredential({
      credential: {
        id: randomUUID(),
        issuer: { id: issuerDid.did },
        issuanceDate: new Date().toISOString(),
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://ipfs.io/ipfs/QmVfQ8qitKypHh9bEHJ2EV23fppCxxicaWaguXEUwq8QFp',
        ],
        credentialSchema: {
          id: 'https://ipfs.io/ipfs/QmVfQ8qitKypHh9bEHJ2EV23fppCxxicaWaguXEUwq8QFp',
          type: 'JsonSchemaValidator2018',
        },
        type: ['VerifiableCredential', 'CampaignCredential'],
        credentialSubject: {
          id: did,
          campaign: 'Test Campaign',
          campaignOrigin: 'https://masca.io',
          serialNumber: 1,
        },
      },
      proofFormat: 'jwt',
    });

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { data: claim, error: claimError } = await supabase
      .from('campaign_claims')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('user_id', user.sub)
      .eq('can_claim', true)
      .single();

    if (claimError) {
      return new NextResponse('Internal Server Error', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (claim) {
      const { data: updatedClaim, error: updatedClaimError } = await supabase
        .from('campaign_claims')
        .update({ claimed_at: new Date().toISOString() })
        .eq('id', claim.id)
        .single();

      if (updatedClaimError || !updatedClaim) {
        return new NextResponse('Internal Server Error', {
          status: 500,
          headers: {
            ...CORS_HEADERS,
          },
        });
      }
    }

    return NextResponse.json(
      {
        credential: vc,
      },
      {
        status: 200,
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
