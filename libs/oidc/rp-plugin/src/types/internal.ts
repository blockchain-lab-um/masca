import {
  AuthorizationResponse,
  CredentialRequest,
  Credentials,
  PresentationDefinition,
  Proof,
  SupportedCredential,
  TokenRequest,
} from '@blockchain-lab-um/oidc-types';

export interface IPluginConfig {
  supported_did_methods: string[]; // e.g. ['ethr', 'key']
  supported_curves: string[]; // e.g. secp256k1, ed25519, etc
  supported_digital_signatures: string[]; // e.g. jwt, json_ld
  db_secret: string;
  url: string;
  supported_credentials?: SupportedCredential[];
}

export interface CreateCredentialOfferRequestArgs {
  credentials: Credentials;
  grants?: (
    | 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
    | 'authorization_code'
  )[];
  userPinRequired?: boolean;
}

export interface CreateCredentialOfferRequestResposne {
  credentialOfferRequest: string;
  credentials: Credentials;
  preAuthorizedCode?: string;
  userPin?: string;
}

export interface HandlePreAuthorizedCodeTokenRequestArgs {
  body: TokenRequest;
  preAuthorizedCode: string;
  userPin?: string;
  overrides?: {
    accessToken?: string;
    accessTokenExpiresIn?: number;
    cNonce?: string;
    cNonceExpiresIn?: number;
  };
}

export interface IsValidTokenRequestArgs {
  body: TokenRequest;
}

export type IsValidTokenRequestResponse = {
  grantType:
    | 'authorization_code'
    | 'urn:ietf:params:oauth:grant-type:pre-authorized_code';
  preAuthorizedCode?: string;
} & (
  | { grantType: 'authorization_code' }
  | {
      grantType: 'urn:ietf:params:oauth:grant-type:pre-authorized_code';
      preAuthorizedCode: string;
    }
);

export interface HandleCredentialRequestArgs {
  body: CredentialRequest;
  issuerDid: string; // DID to use for signing the Credential
  subjectDid: string; // DID to which the Credential is issued
  credentialSubjectClaims: unknown; // Claims to use for the credentialSubject
}

export interface HandleAuthorizationResponseArgs {
  nonce?: string;
  nonceExpiresIn?: number;
  presentationDefinition: PresentationDefinition;
  body: AuthorizationResponse;
}

export interface CreateJWTProofParams {
  privateKey: string;
  audience: string;
  data?: any;
  nonce?: string;
}

export interface ProofOfPossesionArgs {
  proof?: Proof;
  cNonce?: string;
  cNonceExpiresIn?: number;
}

export interface ProofOfPossesionResponseArgs {
  did: string;
}

export interface CreateAuthorizationRequestArgs {
  clientId: string;
  redirectUri: string;
  presentationDefinition: PresentationDefinition;
  state: string;
  overrides?: {
    nonce?: string;
    nonceExpiresIn?: number;
  };
}

export interface CreateAuthorizationRequestResponse {
  authorizationRequest: string;
  nonce: string;
  nonceExpiresIn: number;
}
