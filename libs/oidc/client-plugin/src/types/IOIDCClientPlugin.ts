import type {
  AuthorizationRequest,
  CredentialOffer,
  CredentialResponse,
  PresentationSubmission,
  Proof,
  SupportedCredential,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import type { Result } from '@blockchain-lab-um/utils';
import type { OriginalVerifiableCredential } from '@sphereon/ssi-types';
import type { IAgentContext, IPluginMethodMap, IResolver } from '@veramo/core';

import type {
  CreateIdTokenArgs,
  CreatePresentationSubmissionArgs,
  CreateVpTokenArgs,
  GetAuthorizationRequestArgs,
  GetCredentialInfoByIdArgs,
  ParseOIDCAuthorizationRequestURIArgs,
  ParseOIDCCredentialOfferURIArgs,
  ProofOfPossesionArgs,
  SelectCredentialsArgs,
  SendCredentialRequestArgs,
  SendOIDCAuthorizationResponseArgs,
  SendTokenRequestArgs,
} from './internal.js';

export interface IOIDCClientPlugin extends IPluginMethodMap {
  // For issuance handling
  parseOIDCCredentialOfferURI(
    args: ParseOIDCCredentialOfferURIArgs
  ): Promise<Result<CredentialOffer>>;
  sendTokenRequest(args: SendTokenRequestArgs): Promise<Result<TokenResponse>>;
  sendCredentialRequest(
    args: SendCredentialRequestArgs
  ): Promise<Result<CredentialResponse>>;
  getCredentialInfoById(
    args: GetCredentialInfoByIdArgs
  ): Promise<Result<SupportedCredential>>;

  // For verification handling
  parseOIDCAuthorizationRequestURI(
    args: ParseOIDCAuthorizationRequestURIArgs
  ): Promise<Result<AuthorizationRequest>>;
  selectCredentials(
    args: SelectCredentialsArgs
  ): Promise<Result<OriginalVerifiableCredential[]>>;
  createPresentationSubmission(
    args: CreatePresentationSubmissionArgs
  ): Promise<Result<PresentationSubmission>>;
  createIdToken(args: CreateIdTokenArgs): Promise<Result<string>>;
  createVpToken(args: CreateVpTokenArgs): Promise<Result<string>>;
  getChallenge(): Promise<Result<string>>;
  getDomain(): Promise<Result<string>>;
  sendOIDCAuthorizationResponse(
    args: SendOIDCAuthorizationResponseArgs
  ): Promise<Result<string>>;

  // Common
  getAuthorizationRequest(
    args: GetAuthorizationRequestArgs
  ): Promise<Result<string>>;
  proofOfPossession(args: ProofOfPossesionArgs): Promise<Result<Proof>>;
  reset(): Promise<void>;

  // Other
  setProxyUrl(url: string): Promise<void>;
}

/**
 * Represents the requirements that this plugin has.
 * The agent that is using this plugin is expected to provide these methods.
 *
 * This interface can be used for static type checks, to make sure your application is properly initialized.
 *
 * @beta
 */
export type OIDCClientAgentContext = IAgentContext<IResolver>;
