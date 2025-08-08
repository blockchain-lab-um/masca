import type {
  AuthorizationRequest,
  CredentialOffer,
  CredentialResponse,
  IssuerServerMetadata,
  OAuth2AuthorizationServerMetadata,
  PresentationDefinition,
  PresentationSubmission,
  Proof,
  SupportedCredential,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import {
  type Result,
  ResultObject,
  qsCustomDecoder,
} from '@blockchain-lab-um/utils';
import { PEX, PresentationSubmissionLocation } from '@sphereon/pex';
import type {
  IVerifiableCredential,
  OriginalVerifiableCredential,
} from '@sphereon/ssi-types';
import type { IAgentPlugin } from '@veramo/core';
import { bytesToBase64url, decodeCredentialToObject } from '@veramo/utils';
import { fetch } from 'cross-fetch';
import { sha256 } from 'ethereum-cryptography/sha256.js';
import { decodeJwt } from 'jose';
import qs from 'qs';

import type { IOIDCClientPlugin } from '../types/IOIDCClientPlugin.js';
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
} from '../types/internal.js';

const pex: PEX = new PEX();

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

    // PKCE (Proof Key for Code Exchange)
    codeVerifier: string | null;
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
    //
    codeVerifier: null,
  };

  public proxyUrl = 'https://masca.io/api/proxy/oidc';

  readonly methods: IOIDCClientPlugin = {
    // For issuance handling
    parseOIDCCredentialOfferURI: this.parseOIDCCredentialOfferURI.bind(this),
    sendTokenRequest: this.sendTokenRequest.bind(this),
    sendCredentialRequest: this.sendCredentialRequest.bind(this),
    getCredentialInfoById: this.getCredentialInfoById.bind(this),

    // For verification handling
    parseOIDCAuthorizationRequestURI:
      this.parseOIDCAuthorizationRequestURI.bind(this),
    selectCredentials: this.selectCredentials.bind(this),
    createPresentationSubmission: this.createPresentationSubmission.bind(this),
    getChallenge: this.getChallenge.bind(this),
    getDomain: this.getDomain.bind(this),
    createIdToken: this.createIdToken.bind(this),
    createVpToken: this.createVpToken.bind(this),
    sendOIDCAuthorizationResponse:
      this.sendOIDCAuthorizationResponse.bind(this),

    // Common
    getAuthorizationRequest: this.getAuthorizationRequest.bind(this),
    proofOfPossession: this.proofOfPossession.bind(this),
    reset: this.reset.bind(this),

    // Other
    setProxyUrl: this.setProxyUrl.bind(this),
  };

  public async parseOIDCCredentialOfferURI(
    args: ParseOIDCCredentialOfferURIArgs
  ): Promise<Result<CredentialOffer>> {
    let credentialOffer: CredentialOffer;

    try {
      const query = args.credentialOfferURI.split('?')[1];

      const parsedCredentialOfferUri = qs.parse(query, {
        depth: 50,
        parameterLimit: 1000,
        decoder: qsCustomDecoder,
      });

      if (!parsedCredentialOfferUri) {
        return ResultObject.error('Invalid credential offer URI');
      }

      if (parsedCredentialOfferUri.credential_offer) {
        credentialOffer =
          parsedCredentialOfferUri.credential_offer as CredentialOffer;
      } else if (parsedCredentialOfferUri.credential_offer_uri) {
        // Fetch credential offer from the URI
        const response = await fetch(
          parsedCredentialOfferUri.credential_offer_uri as string
        );

        if (!response.ok) {
          console.log(await response.text());
          return ResultObject.error('Failed to fetch credential offer');
        }

        credentialOffer = await response.json();

        if (!credentialOffer) {
          return ResultObject.error('Failed to parse credential offer');
        }
      } else {
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

  public async sendTokenRequest(
    args: SendTokenRequestArgs
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

    if (
      !credentialOffer.grants?.[
        'urn:ietf:params:oauth:grant-type:pre-authorized_code'
      ] &&
      !credentialOffer.grants?.authorization_code
    ) {
      return ResultObject.error('Unsupported grant type');
    }

    let body: any = {};

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

      body = {
        grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        'pre-authorized_code': preAuthorizedCode,
        ...(userPinRequired && { user_pin: args.pin }),
      };
    }

    if (credentialOffer.grants?.authorization_code) {
      if (!args.code) {
        return ResultObject.error('Authorization code required');
      }

      if (!args.clientId) {
        return ResultObject.error('Client ID required');
      }

      body = {
        grant_type: 'authorization_code',
        code: args.code,
        client_id: args.clientId,
        ...(this.current.codeVerifier && {
          code_verifier: this.current.codeVerifier,
        }),
      };
    }

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(body, { encode: true }),
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

  public async sendCredentialRequest(
    args: SendCredentialRequestArgs
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

    let response = await fetch(`${issuerServerMetadata.credential_endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log(await response.text());
      return ResultObject.error('Failed to acquire credential');
    }

    let credentialResponse = await response.json();

    if (!credentialResponse) {
      return ResultObject.error('Failed to parse credential response');
    }

    // Credential not yet available
    if (credentialResponse.acceptance_token) {
      if (!issuerServerMetadata.deferred_credential_endpoint) {
        return ResultObject.error('Deferred credential endpoint not found');
      }

      // Sleep 6 seconds
      await new Promise((resolve) => setTimeout(resolve, 6000));

      response = await fetch(
        `${issuerServerMetadata.deferred_credential_endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
              credentialResponse.acceptance_token as string
            }`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        console.log(await response.text());
        return ResultObject.error('Failed to acquire credential');
      }

      credentialResponse = await response.json();

      if (!credentialResponse) {
        return ResultObject.error('Failed to parse credential response');
      }
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

    const { issuerServerMetadata, tokenResponse } = this.current;

    const payload = {
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

      const parsedAuthorizationRequest = qs.parse(query, {
        depth: 50,
        parameterLimit: 1000,
      });

      if (!parsedAuthorizationRequest) {
        return ResultObject.error('Invalid authorization request');
      }

      if (parsedAuthorizationRequest.request_uri) {
        // Fetch authorization request from the URI
        const response = await fetch(
          parsedAuthorizationRequest.request_uri as string
        );

        if (!response.ok) {
          console.log(await response.text());
          return ResultObject.error('Failed to fetch authorization request');
        }

        const authorizationRequestJWT = await response.text();
        authorizationRequest = decodeJwt(
          authorizationRequestJWT
        ) as unknown as AuthorizationRequest;
      } else {
        authorizationRequest =
          parsedAuthorizationRequest as unknown as AuthorizationRequest;
      }

      if (
        authorizationRequest.response_type !== 'vp_token' &&
        authorizationRequest.response_type !== 'vp_token id_token' &&
        authorizationRequest.response_type !== 'id_token'
      ) {
        return ResultObject.error(
          'Only `vp_token` or `vp_token id_token` or `id_token` response types are supported'
        );
      }

      if (!authorizationRequest.nonce) {
        return ResultObject.error('Nonce is required');
      }

      // if (authorizationRequest.scope !== 'openid') {
      //   return ResultObject.error('Only openid scope is supported');
      // }

      if (!authorizationRequest.client_id) {
        return ResultObject.error('Client id is required');
      }

      if (!authorizationRequest.redirect_uri) {
        return ResultObject.error('Redirect uri is required');
      }

      if (authorizationRequest.response_type.includes('vp_token')) {
        if (
          !authorizationRequest.presentation_definition &&
          !authorizationRequest.presentation_definition_uri
        ) {
          return ResultObject.error(
            'Presentation definition or presentation definition uri is required'
          );
        }

        if (authorizationRequest.presentation_definition_uri) {
          const response = await fetch(
            authorizationRequest.presentation_definition_uri
          );

          if (!response.ok) {
            return ResultObject.error(
              'Failed to fetch presentation definition'
            );
          }

          const presentationDefinition = await response.json();

          if (!presentationDefinition) {
            return ResultObject.error(
              'Failed to parse presentation definition'
            );
          }

          authorizationRequest.presentation_definition = presentationDefinition;
          this.current.presentationDefinition = presentationDefinition;
        } else {
          this.current.presentationDefinition =
            typeof authorizationRequest.presentation_definition === 'string'
              ? (JSON.parse(
                  authorizationRequest.presentation_definition as unknown as string
                ) as unknown as PresentationDefinition)
              : (authorizationRequest.presentation_definition as unknown as PresentationDefinition);
        }
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
  ): Promise<Result<OriginalVerifiableCredential[]>> {
    const { credentials } = args;

    if (!credentials) {
      return ResultObject.error('Credentials are required');
    }

    const presentationDefinition =
      args.presentationDefinition ?? this.current.presentationDefinition;

    if (!presentationDefinition) {
      return ResultObject.error('Presentation definition not found');
    }

    // NOTE: We filter out `JwtDecodedVerifiableCredential` | `SdJwtDecodedVerifiableCredential` types
    const decodedCredentials = (
      credentials
        .map((credential) =>
          typeof credential === 'string'
            ? (decodeCredentialToObject(credential) as IVerifiableCredential)
            : credential
        )
        .filter((credential) => {
          const castCredentialToVerifiableCredential =
            credential as IVerifiableCredential;

          return (
            castCredentialToVerifiableCredential.proof !== undefined &&
            (Array.isArray(castCredentialToVerifiableCredential.proof)
              ? castCredentialToVerifiableCredential.proof[0].jwt !== undefined
              : castCredentialToVerifiableCredential.proof.jwt !== undefined)
          );
        }) as IVerifiableCredential[]
    ).map((credential: any) =>
      Array.isArray(credential.proof)
        ? (credential.proof[0].jwt as string)
        : (credential.proof.jwt as string)
    );

    const result = pex.selectFrom(
      presentationDefinition as any,
      decodedCredentials
    );

    if (result.areRequiredCredentialsPresent === 'error') {
      return ResultObject.error(
        'Not all credential requests could be satisfied'
      );
    }

    return ResultObject.success(result.verifiableCredential ?? []);
  }

  public async createPresentationSubmission(
    args: CreatePresentationSubmissionArgs
  ): Promise<Result<PresentationSubmission>> {
    const { credentials } = args;

    if (!credentials) {
      return ResultObject.error('Credentials are required');
    }

    const presentationDefinition =
      args.presentationDefinition ?? this.current.presentationDefinition;

    if (!presentationDefinition) {
      return ResultObject.error('Presentation definition not found');
    }

    const presentationSubmission = pex.presentationSubmissionFrom(
      presentationDefinition as any,
      credentials,
      {
        presentationSubmissionLocation: PresentationSubmissionLocation.EXTERNAL,
      }
    );

    return ResultObject.success(presentationSubmission);
  }

  public async getChallenge(): Promise<Result<string>> {
    if (!this.current.authorizationRequest) {
      return ResultObject.error('Authorization request not found');
    }

    const { nonce } = this.current.authorizationRequest;

    if (!nonce) {
      return ResultObject.error('Challenge (nonce) not found');
    }

    return ResultObject.success(nonce);
  }

  public async getDomain(): Promise<Result<string>> {
    if (!this.current.authorizationRequest) {
      return ResultObject.error('Authorization request not found');
    }

    const { client_id: clientId } = this.current.authorizationRequest;

    if (!clientId) {
      return ResultObject.error('Domain (client_id) not found');
    }

    return ResultObject.success(clientId);
  }

  public async createIdToken(args: CreateIdTokenArgs): Promise<Result<string>> {
    if (!this.current.authorizationRequest) {
      return ResultObject.error('Authorization request not found');
    }

    const { nonce, client_id: clientId } = this.current.authorizationRequest;

    if (!nonce) {
      return ResultObject.error('Nonce not found');
    }

    if (!clientId) {
      return ResultObject.error('Client id not found');
    }

    const header = {
      typ: 'JWT',
    };

    const payload = {
      aud: clientId,
      nonce,
    };

    const { sign } = args;

    if (!sign) {
      return ResultObject.error('Sign function not provided');
    }

    const jwt = await sign({
      header,
      payload,
    });

    return ResultObject.success(jwt);
  }

  public async createVpToken(args: CreateVpTokenArgs): Promise<Result<string>> {
    if (!this.current.authorizationRequest) {
      return ResultObject.error('Authorization request not found');
    }

    const { nonce, client_id: clientId } = this.current.authorizationRequest;

    if (!nonce) {
      return ResultObject.error('Nonce not found');
    }

    if (!clientId) {
      return ResultObject.error('Client id not found');
    }

    const { sign, vp } = args;

    const header = {
      typ: 'JWT',
    };

    const payload = {
      aud: clientId,
      nonce,
      vp,
    };

    if (!sign) {
      return ResultObject.error('Sign function not provided');
    }

    const jwt = await sign({
      header,
      payload,
    });

    return ResultObject.success(jwt);
  }

  public async sendOIDCAuthorizationResponse(
    args: SendOIDCAuthorizationResponseArgs
  ): Promise<Result<string>> {
    const { authorizationRequest } = this.current;
    if (!authorizationRequest) {
      return ResultObject.error('Authorization request not found');
    }

    const { redirect_uri: redirectUri } = authorizationRequest;

    if (!redirectUri) {
      return ResultObject.error('Redirect uri not found');
    }

    const { state } = authorizationRequest;

    let body: any = {
      ...(state && { state }),
    };

    if (authorizationRequest.response_type.includes('vp_token')) {
      if (!args.vpToken) {
        return ResultObject.error(
          'vpToken is required when vp_token is requested'
        );
      }

      if (!args.presentationSubmission) {
        return ResultObject.error(
          'Presentation submission is required when vp_token is requested'
        );
      }

      body = {
        ...body,
        vp_token: args.vpToken,
        presentation_submission: JSON.stringify(args.presentationSubmission),
      };
    }

    if (authorizationRequest.response_type.includes('id_token')) {
      if (!args.idToken) {
        return ResultObject.error(
          'Id token is required when id_token is requested'
        );
      }

      body = {
        ...body,
        id_token: args.idToken,
      };
    }

    // FIXME: Implement without proxy and redirects
    const response = await fetch(this.proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ redirectUri, data: body }),
    });

    if (!response.ok) {
      return ResultObject.error('Failed to send authorization response');
    }

    const { location } = await response.json();

    return ResultObject.success(location);
  }

  public async getAuthorizationRequest(
    args: GetAuthorizationRequestArgs
  ): Promise<Result<string>> {
    if (!this.current.authorizationServerMetadata) {
      return ResultObject.error('Authorization server metadata not found');
    }

    if (!this.current.issuerServerMetadata) {
      return ResultObject.error('Issuer server metadata not found');
    }

    const { authorization_endpoint: authorizationEndpoint } =
      this.current.authorizationServerMetadata;

    if (!authorizationEndpoint) {
      return ResultObject.error('Authorization endpoint not found');
    }

    const { clientId } = args;

    // Create code verifier and challenge for PKCE
    const randomBytes = new Uint8Array(50);
    window.crypto.getRandomValues(randomBytes);
    const codeVerifier = bytesToBase64url(randomBytes);
    const codeChallenge = bytesToBase64url(sha256(Buffer.from(codeVerifier)));

    // Save code verifier for token request
    this.current.codeVerifier = codeVerifier;

    // FIXME: How to distinguish what we need to include in the query
    const query = {
      scope: 'openid',
      client_id: clientId,
      response_type: 'code',
      redirect_uri: 'openid://',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: window.crypto.randomUUID(),
      ...(this.current.credentialOffer?.grants?.authorization_code
        ?.issuer_state && {
        issuer_state:
          this.current.credentialOffer?.grants?.authorization_code
            ?.issuer_state,
      }),
      // This can be used to tell the auth server where we want to get redirected
      // client_metadata: JSON.stringify({
      //   authorization_endpoint: "http://localhost:3000/oidc/authorization",
      // }),
      // TODO: Handle if credential is string
      authorization_details: JSON.stringify(
        this.current.credentialOffer?.credentials.map((credential) => {
          const cred = credential as any;
          return {
            type: 'openid_credential',
            format: cred.format,
            locations: [this.current.issuerServerMetadata?.credential_issuer],
            types: cred.types,
          };
        })
      ),
    };

    const url = `${authorizationEndpoint}?${qs.stringify(query, {
      encode: true,
    })}`;

    // FIXME: Implement without proxy and redirects
    const response = await fetch(
      `${this.proxyUrl}?url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      console.log(JSON.stringify(response.text()));
      return ResultObject.error('Failed to get authorization request');
    }

    const { location } = await response.json();

    return ResultObject.success(location);
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

      //
      codeVerifier: null,
    };
  }

  public async setProxyUrl(url: string): Promise<void> {
    this.proxyUrl = url;
  }
}

export default OIDCClientPlugin;
