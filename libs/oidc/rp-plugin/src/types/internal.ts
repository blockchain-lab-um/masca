import {
  AuthorizationResponse,
  CredentialRequest,
  Credentials,
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

export type IsValidAuthorizationHeaderArgs = {
  authorizationHeader: string;
};

export type IsValidAuthorizationHeaderResponse = {
  accessToken: string;
};

export type HandleCredentialRequestArgs = {
  body: CredentialRequest;
  did: string; // DID to use for signing the Credential
  credentialSubjectClaims: unknown; // Claims to use for the credentialSubject
  c_nonce?: string;
  c_nonce_expires_in?: number;
};

export type PrivateKeyToDidRequestArgs = {
  privateKey: string;
  didMethod: string;
};

export type PrivateKeyToDidResponse = {
  did: string;
};

export type HandleAuthorizationResponseArgs = {
  contentTypeHeader: string;
  c_nonce?: string;
  c_nonce_expires_in?: number;
  body: AuthorizationResponse;
};

export type CreateJWTProofParams = {
  privateKey: string;
  audience: string;
  data?: any;
  nonce?: string;
};
