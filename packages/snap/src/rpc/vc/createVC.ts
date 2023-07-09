import type { MinimalUnsignedCredential } from '@blockchain-lab-um/masca-types';
import type { UnsignedCredential } from '@veramo/core';

export async function createUnsignedVerifiableCredential(params: {
  vc: MinimalUnsignedCredential;
  did: string;
}): Promise<UnsignedCredential> {
  const { vc, did } = params;
  if (!vc.credentialSubject) {
    throw new Error('Verifiable credential must have a credentialSubject');
  }
  if (
    vc.type &&
    typeof vc.type === 'string' &&
    vc.type !== 'VerifiableCredential'
  ) {
    throw new Error('Invalid type');
  }

  if (
    (vc.issuer && typeof vc.issuer === 'string' && vc.issuer !== did) ||
    (vc.issuer?.id && vc.issuer.id && vc.issuer.id !== did)
  ) {
    throw new Error('Invalid issuer');
  }

  if (
    vc.type &&
    Array.isArray(vc.type) &&
    !vc.type.includes('VerifiableCredential')
  ) {
    vc.type.unshift('VerifiableCredential');
  }

  if (!vc.type) {
    vc.type = ['VerifiableCredential'];
  }

  const unsignedVc: UnsignedCredential = {
    ...vc,
    type: vc.type,
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    issuer: vc.issuer ? vc.issuer : did,
    issuanceDate: vc.issuanceDate ? vc.issuanceDate : new Date().toISOString(),
  };
  return unsignedVc;
}
