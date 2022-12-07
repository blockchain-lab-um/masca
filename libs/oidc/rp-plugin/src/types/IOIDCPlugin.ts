import {
  Credentials,
  TokenRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { IPluginMethodMap } from '@veramo/core';
import { Result } from '../utils';
import {
  IsValidAuthorizationHeaderResponse,
  IsValidTokenRequestResponse,
} from './internal';

export interface IOIDCPlugin extends IPluginMethodMap {
  createAuthorizationRequest(): Promise<string>;
  handleAuthorizationResponse(args: {
    contentTypeHeader: string;
    body: { id_token: string; vp_token: string };
  }): Promise<void>;
  createIssuanceInitiationRequest(): Promise<
    Result<{
      issuanceInitiationRequest: string;
      preAuthorizedCode: string;
      credentials: Credentials;
    }>
  >;
  handlePreAuthorizedCodeTokenRequest(args: {
    body: TokenRequest;
    preAuthorizedCode: string;
    userPin?: string;
  }): Promise<Result<TokenResponse>>;
  handleCredentialRequest(): Promise<Result<void>>;
  isValidTokenRequest(args: {
    body: TokenRequest;
  }): Promise<Result<IsValidTokenRequestResponse>>;

  isValidAuthorizationHeader(args: {
    authorizationHeader: string;
  }): Promise<Result<IsValidAuthorizationHeaderResponse>>;
}
