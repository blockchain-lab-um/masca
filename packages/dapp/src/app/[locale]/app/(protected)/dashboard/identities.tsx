'use client';

import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import { createClient } from '@/utils/supabase/client';
import { type Tables } from '@/utils/supabase/helper.types';
import { useAuthStore } from '@/stores/authStore';

// TODO: Management of identities
export const Identities = () => {
  const token = useAuthStore((state) => state.token);
  const [identities, setIdentities] = useState<Tables<'identities'>[]>([]);

  useEffect(() => {
    if (!token) return;

    const client = createClient(token);

    const fetchIdentities = async () => {
      const { data, error, status } = await client
        .from('identities')
        .select('*');

      if (!data) return;

      setIdentities(data);
    };

    fetchIdentities().catch((error) => {
      console.error(error);
    });
  }, [token]);

  const handleShareCredential = async () => {
    try {
      const presentation = {
        holder: 'did:ethr:0x1:0x5c97460ef76c4c26a8a82a828b74492bc8c09b61',
        verifiableCredential: [
          '{"type":["VerifiableCredential","MascaUserCredential"],"proof":{"type":"EthereumEip712Signature2021","eip712":{"types":{"Proof":[{"name":"created","type":"string"},{"name":"proofPurpose","type":"string"},{"name":"type","type":"string"},{"name":"verificationMethod","type":"string"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"}],"CredentialSchema":[{"name":"id","type":"string"},{"name":"type","type":"string"}],"CredentialSubject":[{"name":"id","type":"string"},{"name":"type","type":"string"}],"VerifiableCredential":[{"name":"@context","type":"string[]"},{"name":"credentialSchema","type":"CredentialSchema"},{"name":"credentialSubject","type":"CredentialSubject"},{"name":"issuanceDate","type":"string"},{"name":"issuer","type":"string"},{"name":"proof","type":"Proof"},{"name":"type","type":"string[]"}]},"domain":{"name":"VerifiableCredential","chainId":1,"version":"1"},"primaryType":"VerifiableCredential"},"created":"2023-09-04T12:28:25.221Z","proofValue":"0xb29ad85e9e4041d149b5784ad593f51239a22e7cde4b4e11e1bbbc0a6b92a4fa4fbc94c181f230a2a31f41b6b9f23af21d337ce244adf75ca506f07f6b67cd841c","proofPurpose":"assertionMethod","verificationMethod":"did:ethr:0x1:0x5c97460ef76c4c26a8a82a828b74492bc8c09b61#controller"},"issuer":"did:ethr:0x1:0x5c97460ef76c4c26a8a82a828b74492bc8c09b61","@context":["https://www.w3.org/2018/credentials/v1"],"issuanceDate":"2023-09-04T12:28:25.221Z","credentialSchema":{"id":"https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json","type":"JsonSchemaValidator2018"},"credentialSubject":{"id":"did:ethr:0x1:0x5c97460ef76c4c26a8a82a828b74492bc8c09b61","type":"Regular User"}}',
        ],
        type: ['VerifiablePresentation', 'Custom'],
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        issuanceDate: '2023-11-28T14:41:54.514Z',
        proof: {
          verificationMethod:
            'did:ethr:0x1:0x5c97460ef76c4c26a8a82a828b74492bc8c09b61#controller',
          created: '2023-11-28T14:41:54.514Z',
          proofPurpose: 'assertionMethod',
          type: 'EthereumEip712Signature2021',
          proofValue:
            '0x690c7c8c1036da74ca4c3c692541ac711bc06cbb22b9855de2bc19e955458c025e2b0658949002f7e2fc64ef70fb6b0ee597059acbcc3741eb46cf9e7bd9941a1c',
          eip712: {
            domain: {
              chainId: 1,
              name: 'VerifiablePresentation',
              version: '1',
            },
            types: {
              EIP712Domain: [
                {
                  name: 'name',
                  type: 'string',
                },
                {
                  name: 'version',
                  type: 'string',
                },
                {
                  name: 'chainId',
                  type: 'uint256',
                },
              ],
              Proof: [
                {
                  name: 'created',
                  type: 'string',
                },
                {
                  name: 'proofPurpose',
                  type: 'string',
                },
                {
                  name: 'type',
                  type: 'string',
                },
                {
                  name: 'verificationMethod',
                  type: 'string',
                },
              ],
              VerifiablePresentation: [
                {
                  name: '@context',
                  type: 'string[]',
                },
                {
                  name: 'holder',
                  type: 'string',
                },
                {
                  name: 'issuanceDate',
                  type: 'string',
                },
                {
                  name: 'proof',
                  type: 'Proof',
                },
                {
                  name: 'type',
                  type: 'string[]',
                },
                {
                  name: 'verifiableCredential',
                  type: 'string[]',
                },
              ],
            },
            primaryType: 'VerifiablePresentation',
          },
        },
      };
      const result = await fetch('/api/share/presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ presentation }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!token) return null;

  return (
    <div>
      <Button variant="primary" onClick={handleShareCredential}>
        tet
      </Button>
    </div>
  );
};
