import {
  CredentialResponse,
  IssuerServerMetadata,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import {
  IAgentContext,
  ICredentialIssuer,
  ICredentialVerifier,
  IPluginMethodMap,
  IResolver,
} from '@veramo/core';

import { Result } from '../utils';
import {
  CreateAuthorizationRequestArgs,
  CreateAuthorizationRequestResponse,
  CreateCredentialOfferRequestArgs,
  CreateCredentialOfferRequestResposne,
  HandleAuthorizationResponseArgs,
  HandleCredentialRequestArgs,
  HandlePreAuthorizedCodeTokenRequestArgs,
  IsValidTokenRequestArgs,
  IsValidTokenRequestResponse,
  ProofOfPossesionArgs,
  ProofOfPossesionResponseArgs,
} from './internal';

export interface IOIDCPlugin extends IPluginMethodMap {
  createAuthorizationRequest(
    args: CreateAuthorizationRequestArgs
  ): Promise<Result<CreateAuthorizationRequestResponse>>;
  handleAuthorizationResponse(
    args: HandleAuthorizationResponseArgs,
    context: OIDCAgentContext
  ): Promise<Result<boolean>>;
  handleIssuerServerMetadataRequest(): Promise<Result<IssuerServerMetadata>>;
  createCredentialOfferRequest(
    args: CreateCredentialOfferRequestArgs
  ): Promise<Result<CreateCredentialOfferRequestResposne>>;
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
  proofOfPossession(
    args: ProofOfPossesionArgs,
    context: OIDCAgentContext
  ): Promise<Result<ProofOfPossesionResponseArgs>>;
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
  IResolver &
    Pick<ICredentialIssuer, 'createVerifiableCredential'> &
    ICredentialVerifier
>;
