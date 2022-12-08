import {
  CredentialResponse,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import {
  IAgentContext,
  ICredentialIssuer,
  IPluginMethodMap,
  IResolver,
} from '@veramo/core';
import { Result } from '../utils';
import {
  CreateIssuanceInitiationRequestResposne,
  HandleCredentialRequestArgs,
  HandlePreAuthorizedCodeTokenRequestArgs,
  IsValidAuthorizationHeaderArgs,
  IsValidAuthorizationHeaderResponse,
  IsValidTokenRequestArgs,
  IsValidTokenRequestResponse,
} from './internal';

export interface IOIDCPlugin extends IPluginMethodMap {
  createAuthorizationRequest(): Promise<string>;
  handleAuthorizationResponse(args: {
    contentTypeHeader: string;
    body: { id_token: string; vp_token: string };
  }): Promise<void>;
  createIssuanceInitiationRequest(): Promise<
    Result<CreateIssuanceInitiationRequestResposne>
  >;
  handlePreAuthorizedCodeTokenRequest(
    args: HandlePreAuthorizedCodeTokenRequestArgs
  ): Promise<Result<TokenResponse>>;
  handleCredentialRequest(
    args: HandleCredentialRequestArgs,
    context: OIDCAgentContext
  ): Promise<Result<CredentialResponse>>;
  isValidTokenRequest(
    args: IsValidTokenRequestArgs
  ): Promise<Result<IsValidTokenRequestResponse>>;
  isValidAuthorizationHeader(
    args: IsValidAuthorizationHeaderArgs
  ): Promise<Result<IsValidAuthorizationHeaderResponse>>;
}

/**
 * Represents the requirements that this plugin has.
 * The agent that is using this plugin is expected to provide these methods.
 *
 * This interface can be used for static type checks, to make sure your application is properly initialized.
 *
 * @beta
 */
export type OIDCAgentContext = IAgentContext<
  IResolver & Pick<ICredentialIssuer, 'createVerifiableCredential'>
>;
