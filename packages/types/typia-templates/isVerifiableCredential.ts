import { CredentialSchema, CredentialStatus } from '@0xpolygonid/js-sdk';
import { VerifiableCredential, W3CVerifiableCredential } from '@veramo/core';
import typia from 'typia';

interface W3CCredential {
  id: string;
  '@context': string[];
  type: string[];
  expirationDate?: string;
  issuanceDate?: string;
  credentialSubject: Record<string, any>;
  credentialStatus: CredentialStatus;
  issuer: string;
  credentialSchema: CredentialSchema;
  proof?: any;
}

export const isVerifiableCredential = typia.createIs<VerifiableCredential>();
export const isW3CVerifiableCredential =
  typia.createIs<W3CVerifiableCredential>();
export const isW3CCredential = typia.createIs<W3CCredential>();
