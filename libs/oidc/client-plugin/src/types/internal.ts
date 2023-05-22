import type {
  CredentialRequest,
  PresentationDefinition,
} from '@blockchain-lab-um/oidc-types';
import type { OriginalVerifiableCredential } from '@sphereon/ssi-types';

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

export type ParseOIDCAuthorizationRequestURIArgs = {
  authorizationRequestURI: string;
};

export type SelectCredentialsArgs = {
  credentials: OriginalVerifiableCredential[];
  presentationDefinition?: PresentationDefinition;
};

export type CreatePresentationSubmissionArgs = {
  credentials: OriginalVerifiableCredential[];
  presentationDefinition: PresentationDefinition;
};
