import type {
  CredentialRequest,
  PresentationDefinition,
  PresentationSubmission,
} from '@blockchain-lab-um/oidc-types';
import type { OriginalVerifiableCredential } from '@sphereon/ssi-types';
import type { W3CVerifiablePresentation } from '@veramo/core';

export type ParseOIDCCredentialOfferURIArgs = {
  credentialOfferURI: string;
};

export type SendTokenRequestArgs = {
  pin?: string;
  code?: string;
  clientId?: string;
};

export type SendCredentialRequestArgs = CredentialRequest;

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

export type ParseOIDCAuthorizationRequestURIArgs = {
  authorizationRequestURI: string;
};

export type SelectCredentialsArgs = {
  credentials: OriginalVerifiableCredential[];
  presentationDefinition?: PresentationDefinition;
};

export type CreatePresentationSubmissionArgs = {
  credentials: OriginalVerifiableCredential[];
  presentationDefinition?: PresentationDefinition;
};

export type CreateIdTokenArgs = {
  sign: (args: SignArgs) => Promise<string>;
};

export type CreateVpTokenArgs = {
  sign: (args: SignArgs) => Promise<string>;
  vp: W3CVerifiablePresentation;
};

export type SendOIDCAuthorizationResponseArgs = {
  presentationSubmission?: PresentationSubmission;
  idToken?: string;
  vpToken?: string;
};

export type GetAuthorizationRequestArgs = {
  clientId: string;
};
