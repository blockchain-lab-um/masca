import { W3CVerifiableCredential } from '@veramo/core';

export interface QueryVCsRequestResult {
  data: W3CVerifiableCredential;
  metadata: {
    id: string;
    store?: string | string[];
  };
}

export interface SaveVCRequestResult {
  id: string;
  store?: string;
}
