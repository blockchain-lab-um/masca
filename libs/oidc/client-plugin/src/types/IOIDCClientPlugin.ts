import {
  CredentialOffer,
  CredentialResponse,
  Proof,
  SupportedCredential,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { Result } from '@blockchain-lab-um/utils';
import { IAgentContext, IPluginMethodMap, IResolver } from '@veramo/core';

import {
  CredentialRequestArgs,
  GetCredentialInfoByIdArgs,
  ParseOIDCCredentialOfferURIArgs,
  ProofOfPossesionArgs,
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

  // Common
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
