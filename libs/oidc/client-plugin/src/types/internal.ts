import { CredentialRequest } from '@blockchain-lab-um/oidc-types';

export type ParseOIDCCredentialOfferURIArgs = {
  credentialOfferURI: string;
};

export type TokenRequestArgs = {
  pin?: string;
};

export type CredentialRequestArgs = CredentialRequest;

export type SignArgs = {
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
};

export type ProofOfPossesionArgs = {
  sign: (args: SignArgs) => Promise<string>;
};

export type GetCredentialInfoByIdArgs = {
  id: string;
};
