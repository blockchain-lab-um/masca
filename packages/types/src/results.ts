import { VerifiableCredential } from '@veramo/core';

export interface QueryVCsRequestResult {
  data: VerifiableCredential;
  metadata: {
    id: string;
    store?: string[];
  };
}

export interface SaveVCRequestResult {
  id: string;
  store: string[];
}
