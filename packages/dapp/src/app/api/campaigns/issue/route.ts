import { randomUUID } from 'node:crypto';
import { type NextRequest, NextResponse } from 'next/server';
import type { MinimalImportableKey } from '@veramo/core';
import jwt from 'jsonwebtoken';

import { getAgent } from '../../veramoSetup';
import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';

const PRIVATE_KEY = process.env.CAMPAIGN_PRIVATE_KEY!;
const ISSUER = process.env.CAMPAIGN_ISSUER_DID!;

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
    const supabase = supabaseServiceRoleClient();
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*, requirements(id, *)')
      .eq('id', campaignId)
      .order('created_at', { ascending: false })
      .single()
      .throwOnError();

    if (campaignError) {
      return new NextResponse('Campaign not found', {
        status: 404,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (campaign.total && campaign.claimed >= campaign.total) {
      return new NextResponse('Campaign is already fully claimed', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }
    const { data: completedRequirements, error: completedRequirementsError } =
      await supabase.rpc('get_num_of_users_requirements_by_campaign', {
        campaign_id: campaignId,
        user_id: user.sub,
      });

    if (completedRequirementsError) {
      return new NextResponse('Internal Server Error', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }
    if (completedRequirements !== campaign.requirements.length) {
      return new NextResponse('User has not completed all requirements', {
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
      didResolution.didDocument.verificationMethod[0].blockchainAccountId
        ?.split(':')[2]
        .toLowerCase() !== user.address.toLowerCase()
    ) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('user_id', user.sub);

    if (claimError) {
      return new NextResponse('Internal Server Error', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const controllerKeyId = 'key-1';

    const issuerDid = await agent.didManagerImport({
      did: ISSUER,
      provider: 'did:ens',
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

    let claimDate = new Date().toISOString();
    if (claim.length > 0) {
      claimDate = claim[0].claimed_at;
    }
    let credentialId = claim[0]?.credential_id;
    if (claim.length === 0) {
      const { data: insertedClaimData, error: updatedClaimError } =
        await supabase
          .from('claims')
          .insert({
            user_id: user.sub,
            campaign_id: campaignId,
            claimed_at: claimDate,
          })
          .select();
      if (insertedClaimData![0].credential_id) {
        credentialId = insertedClaimData![0].credential_id;
      }
      if (updatedClaimError) {
        if (updatedClaimError.message === 'Claimed cannot exceed Total') {
          return new NextResponse('Campaign is already fully claimed', {
            status: 400,
            headers: {
              ...CORS_HEADERS,
            },
          });
        }

        console.error('Error updating claim', updatedClaimError);
        return new NextResponse('Internal Server Error', {
          status: 500,
          headers: {
            ...CORS_HEADERS,
          },
        });
      }
    }
    // TODO: enhance this probably?
    const credentialSubject: any = {
      ...(campaign.credential_subject as object),
      id: did as string,
    };
    if (credentialId !== undefined && credentialId !== null) {
      credentialSubject.credentialId = credentialId;
    }
    const vc = await agent.createVerifiableCredential({
      credential: {
        id: randomUUID(),
        issuer: issuerDid.did,
        issuanceDate: claimDate,
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          campaign.schema_context_url,
        ],
        credentialSchema: {
          id: campaign.schema_url,
          type: 'JsonSchema',
        },
        type: ['VerifiableCredential', campaign.type],
        credentialSubject,
      },
      proofFormat: 'EthereumEip712Signature2021',
    });

    return NextResponse.json(
      {
        credential: vc,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    if ((error as Error).message === 'jwt expired') {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }
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
