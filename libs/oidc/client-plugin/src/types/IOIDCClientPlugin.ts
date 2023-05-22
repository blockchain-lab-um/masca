import type {
  AuthorizationRequest,
  CredentialOffer,
  CredentialResponse,
  Proof,
  SupportedCredential,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import type { Result } from '@blockchain-lab-um/utils';
import type { IVerifiableCredential } from '@sphereon/ssi-types';
import type { IAgentContext, IPluginMethodMap, IResolver } from '@veramo/core';

import type {
  CredentialRequestArgs,
  GetCredentialInfoByIdArgs,
  ParseOIDCAuthorizationRequestURIArgs,
  ParseOIDCCredentialOfferURIArgs,
  ProofOfPossesionArgs,
  SelectCredentialsArgs,
  TokenRequestArgs,
} from './internal.js';

export interface IOIDCClientPlugin extends IPluginMethodMap {
  // For issuance handling
  parseOIDCCredentialOfferURI(
    args: ParseOIDCCredentialOfferURIArgs
  ): Promise<Result<CredentialOffer>>;
  tokenRequest(args: TokenRequestArgs): Promise<Result<TokenResponse>>;
  credentialRequest(
    args: CredentialRequestArgs
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
  ): Promise<Result<IVerifiableCredential[]>>;

  // createPresentationSubmission(
  //   args: CreatePresentationDefinitionArgs
  // ): Promise<Result<PresentationSubmission>>;

  // Common
  // TODO: There is a difference for the verifier and the issuer
  proofOfPossession(args: ProofOfPossesionArgs): Promise<Result<Proof>>;
  reset(): Promise<void>;
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
