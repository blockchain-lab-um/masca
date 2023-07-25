import type { VerifiableCredential } from '@veramo/core';

export interface QueryCredentialsRequestResult {
  data: VerifiableCredential;
  metadata: {
    id: string;
    store?: string[];
  };
}

export interface SaveCredentialRequestResult {
  id: string;
  store: string[];
}
