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
  supported_credentials: SupportedCredential[];
}

export type CreateCredentialOfferRequestArgs = {
  schema: string;
  grants?: [
    | 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
    | 'authorization_code'
  ];
  userPinRequired?: boolean;
};

export type CreateCredentialOfferRequestResposne = {
  credentialOfferRequest: string;
  credentials: Credentials;
  preAuthorizedCode?: string;
  userPin?: string;
};

export type HandlePreAuthorizedCodeTokenRequestArgs = {
  body: TokenRequest;
  preAuthorizedCode: string;
  userPin?: string;
  overrides?: {
    accessToken?: string;
    accessTokenExpiresIn?: number;
    cNonce?: string;
    cNonceExpiresIn?: number;
  };
};

export type IsValidTokenRequestArgs = {
  body: TokenRequest;
};

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

export type HandleCredentialRequestArgs = {
  body: CredentialRequest;
  issuerDid: string; // DID to use for signing the Credential
  subjectDid: string; // DID to which the Credential is issued
  credentialSubjectClaims: unknown; // Claims to use for the credentialSubject
};

export type HandleAuthorizationResponseArgs = {
  nonce?: string;
  nonceExpiresIn?: number;
  body: AuthorizationResponse;
};

export type CreateJWTProofParams = {
  privateKey: string;
  audience: string;
  data?: any;
  nonce?: string;
};

export type ProofOfPossesionArgs = {
  proof?: Proof;
  cNonce?: string;
  cNonceExpiresIn?: number;
};

export type ProofOfPossesionResponseArgs = {
  did: string;
};

export type CreateAuthorizationRequestArgs = {
  clientId: string;
  redirectUri: string;
  presentationDefinition: PresentationDefinition;
  state: string;
  overrides?: {
    nonce?: string;
    nonceExpiresIn?: number;
  };
};

export type CreateAuthorizationRequestResponse = {
  authorizationRequest: string;
  nonce: string;
  nonceExpiresIn: number;
};
