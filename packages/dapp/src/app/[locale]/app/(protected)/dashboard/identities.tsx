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
        holder: 'did:ethr:0x1:0x81b9ce991ce4c9e1b810325f4de85baaf222e041',
        verifiableCredential: [
          '{"@context":["https://www.w3.org/2018/credentials/v1"],"credentialSchema":{"id":"https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json","type":"JsonSchemaValidator2018"},"credentialSubject":{"id":"did:ethr:0x1:0x81b9ce991ce4c9e1b810325f4de85baaf222e041","type":"Regular Ussdfasdfsdaer"},"issuanceDate":"2023-11-29T14:09:21.387Z","issuer":"did:ethr:0x1:0x81b9ce991ce4c9e1b810325f4de85baaf222e041","proof":{"created":"2023-11-29T14:09:21.387Z","eip712":{"domain":{"chainId":1,"name":"VerifiableCredential","version":"1"},"primaryType":"VerifiableCredential","types":{"CredentialSchema":[{"name":"id","type":"string"},{"name":"type","type":"string"}],"CredentialSubject":[{"name":"id","type":"string"},{"name":"type","type":"string"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"}],"Proof":[{"name":"created","type":"string"},{"name":"proofPurpose","type":"string"},{"name":"type","type":"string"},{"name":"verificationMethod","type":"string"}],"VerifiableCredential":[{"name":"@context","type":"string[]"},{"name":"credentialSchema","type":"CredentialSchema"},{"name":"credentialSubject","type":"CredentialSubject"},{"name":"issuanceDate","type":"string"},{"name":"issuer","type":"string"},{"name":"proof","type":"Proof"},{"name":"type","type":"string[]"}]}},"proofPurpose":"assertionMethod","proofValue":"0xf4b918822cd3e5a3d0cb662cc5a512fe1afc1b19414b262a914f7e8fa6a35ef026ed1bcc7a1516e24f02d39443f48eea0e236d4d3551e5d3ae244b2587edbdb91b","type":"EthereumEip712Signature2021","verificationMethod":"did:ethr:0x1:0x81b9ce991ce4c9e1b810325f4de85baaf222e041#controller"},"type":["VerifiableCredential","MascaUserCredential"]}',
          '{"type":["VerifiableCredential","MascaUserCredential"],"proof":{"type":"EthereumEip712Signature2021","eip712":{"types":{"Proof":[{"name":"created","type":"string"},{"name":"proofPurpose","type":"string"},{"name":"type","type":"string"},{"name":"verificationMethod","type":"string"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"}],"CredentialSchema":[{"name":"id","type":"string"},{"name":"type","type":"string"}],"CredentialSubject":[{"name":"id","type":"string"},{"name":"type","type":"string"}],"VerifiableCredential":[{"name":"@context","type":"string[]"},{"name":"credentialSchema","type":"CredentialSchema"},{"name":"credentialSubject","type":"CredentialSubject"},{"name":"issuanceDate","type":"string"},{"name":"issuer","type":"string"},{"name":"proof","type":"Proof"},{"name":"type","type":"string[]"}]},"domain":{"name":"VerifiableCredential","chainId":1,"version":"1"},"primaryType":"VerifiableCredential"},"created":"2023-11-29T10:03:00.315Z","proofValue":"0xcb1ad947ee0c6d08a862a39bd4ec0b96e839a14aba8f874374174bd8c469d3b0676e67330cf4525b35c9e1d5707256de103c1b473ae043997a9f00dad6abefba1c","proofPurpose":"assertionMethod","verificationMethod":"did:ethr:0x1:0x81b9ce991ce4c9e1b810325f4de85baaf222e041#controller"},"issuer":"did:ethr:0x1:0x81b9ce991ce4c9e1b810325f4de85baaf222e041","@context":["https://www.w3.org/2018/credentials/v1"],"issuanceDate":"2023-11-29T10:03:00.315Z","credentialSchema":{"id":"https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json","type":"JsonSchemaValidator2018"},"credentialSubject":{"id":"did:ethr:0x1:0x81b9ce991ce4c9e1b810325f4de85baaf222e041","type":"Regular User"}}',
        ],
        type: ['VerifiablePresentation', 'Custom'],
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        issuanceDate: '2023-11-29T14:09:35.264Z',
        proof: {
          verificationMethod:
            'did:ethr:0x1:0x81b9ce991ce4c9e1b810325f4de85baaf222e041#controller',
          created: '2023-11-29T14:09:35.264Z',
          proofPurpose: 'assertionMethod',
          type: 'EthereumEip712Signature2021',
          proofValue:
            '0xca87173f4059e2cb807c6e635e3701e11222c9deb827c5125f4d1329078b804335bfc37b4eca2e90c23ebda98c18d83503462a25ce9076cf1899aeb1435213021b',
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
