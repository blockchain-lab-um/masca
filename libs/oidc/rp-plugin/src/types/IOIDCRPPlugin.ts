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
import { ICredentialIssuerEIP712 } from '@veramo/credential-eip712';
import { ICredentialIssuerLD } from '@veramo/credential-ld';

import { Result } from '../utils/index.js';
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
} from './internal.js';

export interface IOIDCRPPlugin extends IPluginMethodMap {
  createAuthorizationRequest(
    args: CreateAuthorizationRequestArgs
  ): Promise<Result<CreateAuthorizationRequestResponse>>;
  handleAuthorizationResponse(
    args: HandleAuthorizationResponseArgs,
    context: OIDCRPAgentContext
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
    context: OIDCRPAgentContext
  ): Promise<Result<CredentialResponse>>;
  isValidTokenRequest(
    args: IsValidTokenRequestArgs
  ): Promise<Result<IsValidTokenRequestResponse>>;
  proofOfPossession(
    args: ProofOfPossesionArgs,
    context: OIDCRPAgentContext
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
export type OIDCRPAgentContext = IAgentContext<
  IResolver &
    Pick<ICredentialIssuer, 'createVerifiableCredential'> &
    ICredentialVerifier &
    ICredentialIssuerLD &
    ICredentialIssuerEIP712
>;
