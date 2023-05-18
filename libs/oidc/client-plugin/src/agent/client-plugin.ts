import {
  CredentialOffer,
  CredentialResponse,
  IssuerServerMetadata,
  Proof,
  SupportedCredential,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { Result, ResultObject } from '@blockchain-lab-um/utils';
import { IAgentPlugin } from '@veramo/core';
import { fetch } from 'cross-fetch';
import qs from 'qs';

import type { IOIDCClientPlugin } from '../types/IOIDCClientPlugin.js';
import {
  CredentialRequestArgs,
  GetCredentialInfoByIdArgs,
  ParseOIDCCredentialOfferURIArgs,
  ProofOfPossesionArgs,
  TokenRequestArgs,
} from '../types/internal.js';

/**
 * {@inheritDoc IMyAgentPlugin}
 * @beta
 */
export class OIDCClientPlugin implements IAgentPlugin {
  private current: {
    issuerServerMetadata: IssuerServerMetadata | null;
    credentialOffer: CredentialOffer | null;
    tokenResponse: TokenResponse | null;
    credentialResponse: CredentialResponse | null;
  } = {
    issuerServerMetadata: null,
    credentialOffer: null,
    tokenResponse: null,
    credentialResponse: null,
  };

  readonly methods: IOIDCClientPlugin = {
    // For issuance handling
    parseOIDCCredentialOfferURI: this.parseOIDCCredentialOfferURI.bind(this),
    tokenRequest: this.tokenRequest.bind(this),
    credentialRequest: this.credentialRequest.bind(this),
    getCredentialInfoById: this.getCredentialInfoById.bind(this),

    // For verification handling

    // Common
    proofOfPossession: this.proofOfPossession.bind(this),
    reset: this.reset.bind(this),
  };

  public async parseOIDCCredentialOfferURI(
    args: ParseOIDCCredentialOfferURIArgs
  ): Promise<Result<CredentialOffer>> {
    let credentialOffer: CredentialOffer;

    try {
      const query = args.credentialOfferURI.split('?')[1];

      credentialOffer = qs.parse(query, {
        depth: 50,
        parameterLimit: 1000,
      }) as unknown as CredentialOffer;

      if (!credentialOffer) {
        return ResultObject.error('Invalid credential offer URI');
      }

      // Credential issuer is required
      if (!credentialOffer.credential_issuer) {
        return ResultObject.error(
          'Missing credential_issuer in credential offer'
        );
      }

      // Credentials are required
      if (!credentialOffer.credentials) {
        return ResultObject.error('Missing credentials in credential offer');
      }

      // Fetch issuer server metadata
      const response = await fetch(
        `${credentialOffer.credential_issuer}/.well-known/openid-credential-issuer`
      );

      if (!response.ok) {
        console.log(await response.text());
        return ResultObject.error('Failed to fetch issuer server metadata');
      }

      const serverMetadata = await response.json();

      if (!serverMetadata) {
        return ResultObject.error('Failed to parse issuer server metadata');
      }

      this.current.issuerServerMetadata = serverMetadata;
      this.current.credentialOffer = credentialOffer;

      return ResultObject.success(credentialOffer);
    } catch (e) {
      console.log(e);
      return ResultObject.error(
        `An unexpected error occurred: ${JSON.stringify(e)}`
      );
    }
  }

  public async tokenRequest(
    args: TokenRequestArgs
  ): Promise<Result<TokenResponse>> {
    if (!this.current.issuerServerMetadata) {
      return ResultObject.error('Issuer server metadata not found');
    }

    if (!this.current.credentialOffer) {
      return ResultObject.error('Credential offer not found');
    }

    const { issuerServerMetadata, credentialOffer } = this.current;

    if (
      credentialOffer.grants?.[
        'urn:ietf:params:oauth:grant-type:pre-authorized_code'
      ]
    ) {
      const {
        'pre-authorized_code': preAuthorizedCode,
        user_pin_required: userPinRequired,
      } =
        credentialOffer.grants[
          'urn:ietf:params:oauth:grant-type:pre-authorized_code'
        ];

      if (userPinRequired && !args.pin) {
        return ResultObject.error('User PIN required');
      }

      const body = {
        grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        'pre-authorized_code': preAuthorizedCode,
        ...(userPinRequired && { user_pin: args.pin }),
      };

      const response = await fetch(`${issuerServerMetadata.token_endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify(body),
      });

      if (!response.ok) {
        console.log(await response.text());
        return ResultObject.error('Failed to acquire access token');
      }

      const tokenResponse = await response.json();

      if (!tokenResponse) {
        return ResultObject.error('Failed to parse access token response');
      }

      this.current.tokenResponse = tokenResponse;

      return ResultObject.success(tokenResponse);
    }

    return ResultObject.error('Grant type not supported');
  }

  public async credentialRequest(
    args: CredentialRequestArgs
  ): Promise<Result<CredentialResponse>> {
    if (!this.current.issuerServerMetadata) {
      return ResultObject.error('Issuer server metadata not found');
    }

    if (!this.current.credentialOffer) {
      return ResultObject.error('Credential offer not found');
    }

    if (!this.current.tokenResponse) {
      return ResultObject.error('Token response not found');
    }

    const { issuerServerMetadata, tokenResponse } = this.current;

    const body = {
      ...args,
    };

    const response = await fetch(
      `${issuerServerMetadata.credential_endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      console.log(await response.text());
      return ResultObject.error('Failed to acquire credential');
    }

    const credentialResponse = await response.json();

    if (!credentialResponse) {
      return ResultObject.error('Failed to parse credential response');
    }

    this.current.credentialResponse = credentialResponse;

    return ResultObject.success(credentialResponse);
  }

  public async proofOfPossession(
    args: ProofOfPossesionArgs
  ): Promise<Result<Proof>> {
    if (!this.current.issuerServerMetadata) {
      return ResultObject.error('Issuer server metadata not found');
    }

    if (!this.current.credentialOffer) {
      return ResultObject.error('Credential offer not found');
    }

    if (!this.current.tokenResponse) {
      return ResultObject.error('Token response not found');
    }

    const { credentialOffer, issuerServerMetadata, tokenResponse } =
      this.current;

    const payload = {
      sub: credentialOffer.credential_issuer,
      aud: issuerServerMetadata.credential_issuer,
      ...(tokenResponse.c_nonce && { nonce: tokenResponse.c_nonce }),
    };

    const header = {
      typ: 'openid4vci-proof+jwt',
    };

    const { sign } = args;

    if (!sign) {
      return ResultObject.error('Sign function not provided');
    }

    const jwt = await sign({
      header,
      payload,
    });

    return ResultObject.success({
      proof_type: 'jwt',
      jwt,
    });
  }

  public async getCredentialInfoById(
    args: GetCredentialInfoByIdArgs
  ): Promise<Result<SupportedCredential>> {
    // Search for credential in issuer server metadata supported credentials

    if (!this.current.issuerServerMetadata) {
      return ResultObject.error('Issuer server metadata not found');
    }

    const { issuerServerMetadata } = this.current;

    const credential = issuerServerMetadata.credentials_supported.find(
      (cred) => cred.id === args.id
    );

    if (!credential) {
      return ResultObject.error('Credential not found');
    }

    return ResultObject.success(credential);
  }

  public async reset(): Promise<void> {
    this.current = {
      issuerServerMetadata: null,
      credentialOffer: null,
      tokenResponse: null,
      credentialResponse: null,
    };
  }
}

export default OIDCClientPlugin;
