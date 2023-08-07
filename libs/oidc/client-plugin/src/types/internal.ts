import type {
  CredentialRequest,
  PresentationDefinition,
  PresentationSubmission,
} from '@blockchain-lab-um/oidc-types';
import type { OriginalVerifiableCredential } from '@sphereon/ssi-types';
import type { UnsignedPresentation } from '@veramo/core';

export interface ParseOIDCCredentialOfferURIArgs {
  credentialOfferURI: string;
}

export interface SendTokenRequestArgs {
  pin?: string;
  code?: string;
  clientId?: string;
}

export type SendCredentialRequestArgs = CredentialRequest;

export interface SignArgs {
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface ProofOfPossesionArgs {
  sign: (args: SignArgs) => Promise<string>;
}

export interface GetCredentialInfoByIdArgs {
  id: string;
}

export interface ParseOIDCAuthorizationRequestURIArgs {
  authorizationRequestURI: string;
}

export interface SelectCredentialsArgs {
  credentials: OriginalVerifiableCredential[];
  presentationDefinition?: PresentationDefinition;
}

export interface CreatePresentationSubmissionArgs {
  credentials: OriginalVerifiableCredential[];
  presentationDefinition?: PresentationDefinition;
}

export interface CreateIdTokenArgs {
  sign: (args: SignArgs) => Promise<string>;
}

export interface CreateVpTokenArgs {
  sign: (args: SignArgs) => Promise<string>;
  vp: UnsignedPresentation;
}

export interface SendOIDCAuthorizationResponseArgs {
  presentationSubmission?: PresentationSubmission;
  idToken?: string;
  vpToken?: string;
}

export interface GetAuthorizationRequestArgs {
  clientId: string;
}
