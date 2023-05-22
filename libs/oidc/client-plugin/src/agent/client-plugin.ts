import {
  type AuthorizationRequest,
  type CredentialOffer,
  type CredentialResponse,
  type IssuerServerMetadata,
  type OAuth2AuthorizationServerMetadata,
  type PresentationDefinition,
  type PresentationSubmission,
  type Proof,
  type SupportedCredential,
  type TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { ResultObject, type Result } from '@blockchain-lab-um/utils';
import { PEX } from '@sphereon/pex';
import type { IVerifiableCredential } from '@sphereon/ssi-types';
import type { IAgentPlugin } from '@veramo/core';
import { fetch } from 'cross-fetch';
import qs from 'qs';

import type { IOIDCClientPlugin } from '../types/IOIDCClientPlugin.js';
import type {
  CreatePresentationSubmissionArgs,
  CredentialRequestArgs,
  GetCredentialInfoByIdArgs,
  ParseOIDCAuthorizationRequestURIArgs,
  ParseOIDCCredentialOfferURIArgs,
  ProofOfPossesionArgs,
  SelectCredentialsArgs,
  TokenRequestArgs,
} from '../types/internal.js';

const pex: PEX = new PEX();

/**
 * {@inheritDoc IMyAgentPlugin}
 * @beta
 */
export class OIDCClientPlugin implements IAgentPlugin {
  public current: {
    issuerServerMetadata: IssuerServerMetadata | null;
    credentialOffer: CredentialOffer | null;
    tokenResponse: TokenResponse | null;
    credentialResponse: CredentialResponse | null;

    //
    authorizationRequest: AuthorizationRequest | null;
    presentationDefinition: PresentationDefinition | null;
    presentationSubmission: PresentationSubmission | null;

    //
    authorizationServerMetadata: OAuth2AuthorizationServerMetadata | null;
  } = {
    issuerServerMetadata: null,
    credentialOffer: null,
    tokenResponse: null,
    credentialResponse: null,
    //
    authorizationRequest: null,
    presentationDefinition: null,
    presentationSubmission: null,
    //
    authorizationServerMetadata: null,
  };

  readonly methods: IOIDCClientPlugin = {
    // For issuance handling
    parseOIDCCredentialOfferURI: this.parseOIDCCredentialOfferURI.bind(this),
    tokenRequest: this.tokenRequest.bind(this),
    credentialRequest: this.credentialRequest.bind(this),
    getCredentialInfoById: this.getCredentialInfoById.bind(this),

    // For verification handling
    parseOIDCAuthorizationRequestURI:
      this.parseOIDCAuthorizationRequestURI.bind(this),
    selectCredentials: this.selectCredentials.bind(this),
    createPresentationSubmission: this.createPresentationSubmission.bind(this),

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
      }).credential_offer as unknown as CredentialOffer;

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
      let response = await fetch(
        `${credentialOffer.credential_issuer}/.well-known/openid-credential-issuer`
      );

      if (!response.ok) {
        console.log(await response.text());
        return ResultObject.error('Failed to fetch issuer server metadata');
      }

      const serverMetadata: IssuerServerMetadata = await response.json();

      if (!serverMetadata) {
        return ResultObject.error('Failed to parse issuer server metadata');
      }

      if (
        !serverMetadata.token_endpoint &&
        !serverMetadata.authorization_server
      ) {
        return ResultObject.error(
          'Either token_endpoint or authorization_server must be present in issuer server metadata'
        );
      }

      if (serverMetadata.authorization_server) {
        response = await fetch(
          `${serverMetadata.authorization_server}/.well-known/openid-configuration`
        );

        if (!response.ok) {
          console.log(await response.text());
          return ResultObject.error(
            'Failed to fetch authorization server metadata'
          );
        }

        const authorizationServerMetadata: OAuth2AuthorizationServerMetadata =
          await response.json();

        if (!authorizationServerMetadata) {
          return ResultObject.error(
            'Failed to parse authorization server metadata'
          );
        }

        this.current.authorizationServerMetadata = authorizationServerMetadata;
        console.log(authorizationServerMetadata);
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

    const {
      issuerServerMetadata,
      authorizationServerMetadata,
      credentialOffer,
    } = this.current;

    const tokenEndpoint =
      issuerServerMetadata.token_endpoint ??
      authorizationServerMetadata?.token_endpoint;

    if (!tokenEndpoint) {
      return ResultObject.error('Token endpoint not found');
    }

    console.log(issuerServerMetadata);

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

      console.log(body);

      const response = await fetch(tokenEndpoint, {
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

  public async parseOIDCAuthorizationRequestURI(
    args: ParseOIDCAuthorizationRequestURIArgs
  ): Promise<Result<AuthorizationRequest>> {
    // TODO: Support for jwks encryption ?

    let authorizationRequest: AuthorizationRequest;

    try {
      const query = args.authorizationRequestURI.split('?')[1];

      authorizationRequest = qs.parse(query, {
        depth: 50,
        parameterLimit: 1000,
      }) as unknown as AuthorizationRequest;

      if (!authorizationRequest) {
        return ResultObject.error('Failed to parse authorization request');
      }

      if (!authorizationRequest.nonce) {
        return ResultObject.error('Nonce is required');
      }

      if (
        !authorizationRequest.presentation_definition &&
        !authorizationRequest.presentation_definition_uri
      ) {
        return ResultObject.error(
          'Presentation definition or presentation definition uri is required'
        );
      }

      if (
        authorizationRequest.id_token_type &&
        authorizationRequest.id_token_type !== 'subject_signed'
      ) {
        return ResultObject.error(
          'Only subject_signed id token type is supported'
        );
      }

      if (authorizationRequest.scope !== 'openid') {
        return ResultObject.error('Only openid scope is supported');
      }

      if (
        authorizationRequest.response_type !== 'vp_token' &&
        authorizationRequest.response_type !== 'vp_token id_token'
      ) {
        return ResultObject.error(
          'Only vp_token or vp_token id_token response type is supported'
        );
      }

      if (!authorizationRequest.client_id) {
        return ResultObject.error('Client id is required');
      }

      if (!authorizationRequest.redirect_uri) {
        return ResultObject.error('Redirect uri is required');
      }

      if (authorizationRequest.presentation_definition_uri) {
        const response = await fetch(
          authorizationRequest.presentation_definition_uri
        );

        if (!response.ok) {
          return ResultObject.error('Failed to fetch presentation definition');
        }

        const presentationDefinition = await response.json();

        if (!presentationDefinition) {
          return ResultObject.error('Failed to parse presentation definition');
        }

        authorizationRequest.presentation_definition = presentationDefinition;
      } else {
        this.current.presentationDefinition =
          authorizationRequest.presentation_definition as PresentationDefinition;
      }

      this.current.authorizationRequest = authorizationRequest;

      return ResultObject.success(authorizationRequest);
    } catch (e) {
      console.log(e);
      return ResultObject.error(
        `An unexpected error occurred: ${JSON.stringify(e)}`
      );
    }
  }

  public async selectCredentials(
    args: SelectCredentialsArgs
  ): Promise<Result<IVerifiableCredential[]>> {
    const { credentials, presentationDefinition } = args;

    if (!credentials) {
      return ResultObject.error('Credentials are required');
    }

    if (presentationDefinition) {
      const { verifiableCredential } = pex.selectFrom(
        presentationDefinition,
        credentials
      );

      if (!verifiableCredential) {
        return ResultObject.error('Failed to select credentials');
      }

      return ResultObject.success(verifiableCredential);
    }

    if (!this.current.presentationDefinition) {
      return ResultObject.error('Presentation definition not found');
    }

    const { verifiableCredential } = pex.selectFrom(
      this.current.presentationDefinition,
      credentials
    );

    if (!verifiableCredential) {
      return ResultObject.error('Failed to select credentials');
    }

    return ResultObject.success(verifiableCredential);
  }

  public async createPresentationSubmission(
    args: CreatePresentationSubmissionArgs
  ): Promise<Result<PresentationSubmission>> {
    console.log(args);
    return ResultObject.error('Issuer server metadata not found');
  }

  public async reset(): Promise<void> {
    this.current = {
      issuerServerMetadata: null,
      credentialOffer: null,
      tokenResponse: null,
      credentialResponse: null,

      //
      authorizationRequest: null,
      presentationSubmission: null,
      presentationDefinition: null,

      //
      authorizationServerMetadata: null,
    };
  }
}

export default OIDCClientPlugin;
