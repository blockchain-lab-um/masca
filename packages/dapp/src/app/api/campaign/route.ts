import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { MinimalImportableKey } from '@veramo/core';

import { getAgent } from '../veramoSetup';

const PRIVATE_KEY = process.env.CAMPAIGN_PRIVATE_KEY;
const ISSUER = 'did:ens:masca.eth';

export async function POST(request: Request) {
  const { did } = await request.json();
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

  return NextResponse.json(
    {
      credential: vc,
    },
    {
      status: 200,
    }
  );
}

export async function OPTIONS(_: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
