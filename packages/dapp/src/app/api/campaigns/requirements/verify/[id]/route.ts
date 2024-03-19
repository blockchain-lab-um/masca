import { NextRequest, NextResponse } from 'next/server';
import {
  VerifiableCredential,
  VerifiablePresentation,
  W3CVerifiablePresentation,
} from '@veramo/core';
import jwt from 'jsonwebtoken';

import { getAgent } from '@/app/api/veramoSetup';
import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
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

    if (!id) {
      return new NextResponse('Missing requirement_id', {
        status: 400,
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

    const { data: userRequirements, error: userRequirementsError } =
      await supabase
        .from('users_requirements')
        .select('*')
        .eq('user_id', user.sub)
        .eq('requirement_id', id);

    if (userRequirementsError) {
      return new NextResponse('Error getting user requirements', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (userRequirements.length !== 0) {
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
    }

    let {
      presentation,
      did,
    }: {
      presentation: W3CVerifiablePresentation;
      did: string;
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
      return new NextResponse('Missing did', {
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
      didResolution.didDocument.verificationMethod[0].blockchainAccountId?.split(
        ':'
      )[2] !== user.address.toLowerCase()
    ) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const { data: requirement, error: requirementsError } = await supabase
      .from('requirements')
      .select('*')
      .eq('id', id)
      .single();

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

    const credentials = presentation.verifiableCredential.map(
      (vc) => JSON.parse(vc as string) as VerifiableCredential
    );

    // TODO - simplify to only check the one requirement as long as the user has not selected the vcs for vp
    const canClaim = (requirement.types ?? []).every((type) =>
      credentials.some((credential) => {
        let cred: VerifiableCredential;

        // Decode credential
        if (typeof credential === 'string') {
          const decoded = jwt.decode(credential);
          if (typeof decoded === 'string') return false;
          cred = decoded as VerifiableCredential;
        } else {
          cred = credential;
        }

        // Check issuer
        const issuer =
          typeof cred.issuer === 'string' ? cred.issuer : cred.issuer.id;

        if (issuer !== requirement.issuer) {
          return false;
        }

        // Check credential type
        if (!cred.type) return false;
        const credTypes =
          typeof cred.type === 'string' ? [cred.type] : cred.type;

        return credTypes.includes(type);
      })
    );

    if (canClaim) {
      const { error: insertedError } = await supabase
        .from('users_requirements')
        .insert({
          user_id: user.sub,
          requirement_id: id,
        });

      if (insertedError) {
        return new NextResponse('Internal Server Error', {
          status: 500,
          headers: {
            ...CORS_HEADERS,
          },
        });
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
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Requirement not met',
      },
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
        },
      }
    );
  } catch (error) {
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
