import { IAgentPlugin } from '@veramo/core';
import qs from 'qs';
import { randomUUID } from 'crypto';
import {
  CredentialRequest,
  CredentialResponse,
  Credentials,
  IssuanceRequestParams,
  TokenRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { Result } from 'src/utils';
import { jwtVerify, decodeProtectedHeader } from 'jose';
import {
  Claims,
  IPluginConfig,
  IsValidAuthorizationHeaderResponse,
  IsValidTokenRequestResponse,
} from '../types/internal';
import { IOIDCPlugin } from '../types/IOIDCPlugin';

/**
 * {@inheritDoc IMyAgentPlugin}
 * @beta
 */
export class OIDCPlugin implements IAgentPlugin {
  // readonly schema = schema.OIDCPlugin;
  private pluginConfig: IPluginConfig = {} as IPluginConfig;

  constructor(config: IPluginConfig) {
    this.pluginConfig = config;
  }

  readonly methods: IOIDCPlugin = {
    createAuthorizationRequest: this.createAuthenticationRequest.bind(this),
    handleAuthorizationResponse: this.handleAuthenticationResponse.bind(this),
    createIssuanceInitiationRequest:
      this.createIssuanceInitiationRequest.bind(this),
    isValidTokenRequest: this.isValidTokenRequest.bind(this),
    handlePreAuthorizedCodeTokenRequest:
      this.handlePreAuthorizedCodeTokenRequest.bind(this),
    handleCredentialRequest: this.handleCredentialRequest.bind(this),
    isValidAuthorizationHeader: this.isValidAuthorizationHeader.bind(this),
  };

  // Create Self-Issued OpenID Provider Authentication Request
  // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-10
  public async createAuthenticationRequest(): Promise<string> {
    // https://identity.foundation/presentation-exchange/
    // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-5

    // TODO: Include either presentation_definition or presentation_definition_uri
    const claims: Claims = {
      presentation_definition: {
        id: 'id card credential (example)',
        // Format type registry: https://identity.foundation/claim-format-registry/#registry
        // https://identity.foundation/presentation-exchange/#presentation-definition
        format: {
          jwt_vc: {
            alg: ['ES256K'],
          },
          jwt_vp: {
            alg: ['ES256K'],
          },
        },
        input_descriptors: [
          {
            id: 'id card credential (example)',
            name: 'ID Card',
            purpose: 'To verify your identity',
            constraints: {
              limit_disclosure: 'required',
              fields: [
                // TODO: Make it generic
                {
                  path: ['$.type'],
                  filter: {
                    type: 'string',
                    pattern: 'IDCardCredential',
                  },
                },
                {
                  path: ['$.credentialSubject.givenName'],
                  purpose: 'To verify your identity',
                },
              ],
            },
          },
        ],
      },
    };

    const redirectUri = 'https://example.com/redirect'; // Change this to your redirect URI
    const nonce = randomUUID();

    // TODO: Support signed version of request -> client_id needs to be a DID
    // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-8.2.3 - client_metadata
    const params = {
      response_type: 'id_token',
      // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-9.2.1
      client_id: redirectUri,
      redirect_uri: redirectUri,
      scope: 'openid',
      nonce,
      claims: JSON.stringify(claims),
    };

    // TODO: Redirect handling
    return `openid://?${qs.stringify(params)}`;
  }

  public async handleAuthenticationResponse(args: {
    contentTypeHeader: string;
    body: { id_token: string; vp_token: string };
  }): Promise<void> {
    const { contentTypeHeader, body } = args;
    // Response needs to include `Content-Type` header with value `application/x-www-form-urlencoded`
    // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-11.2
    // Checks if header includes `application/x-www-form-urlencoded`
    console.log(contentTypeHeader, body);

    // const { id_token: idToken, vp_token: vpToken } = body;
  }

  public async createIssuanceInitiationRequest(): Promise<
    Result<{
      issuanceInitiationRequest: string;
      preAuthorizedCode: string;
      credentials: Credentials;
    }>
  > {
    const preAuthorizedCode = randomUUID();
    const credentials: Credentials = [
      {
        format: 'jwt_vc_json',
        types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      },
    ];

    const params: IssuanceRequestParams = {
      issuer: this.pluginConfig.url,
      credentials,
      'pre-authorized_code': preAuthorizedCode,
    };

    return {
      success: true,
      data: {
        issuanceInitiationRequest: `openid_initiate_issuance://credential_offer?${qs.stringify(
          params
        )}`,
        preAuthorizedCode,
        credentials,
      },
    };
  }

  /**
   *
   * @param args
   * @returns
   */
  public async isValidTokenRequest(args: {
    body: TokenRequest;
  }): Promise<Result<IsValidTokenRequestResponse>> {
    const { body } = args;

    if (body.grant_type === 'authorization_code') {
      return { success: false, error: new Error('Not implemented') };
    }

    if (
      body.grant_type === 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
    ) {
      if (!body['pre-authorized_code']) {
        return {
          success: false,
          error: new Error('Invalid or missing pre-authorized_code'),
        };
      }

      return {
        success: true,
        data: {
          grantType: body.grant_type,
          preAuthorizedCode: body['pre-authorized_code'],
        },
      };
    }

    return {
      success: false,
      error: new Error('Invalid grant_type'),
    };
  }

  // TODO: Optional parameter to change accessToken, cNonce,...
  public async handlePreAuthorizedCodeTokenRequest(args: {
    body: TokenRequest;
    preAuthorizedCode: string;
    userPin?: string;
  }): Promise<Result<TokenResponse>> {
    const { body, preAuthorizedCode, userPin } = args;
    // FIXME - Split authorization_code and pre-authorized_code

    if (body['pre-authorized_code'] !== preAuthorizedCode) {
      // TODO: Implement
      return {
        success: false,
        error: new Error('Invalid or missing pre-authorized_code'),
      };
    }

    if (userPin && userPin !== body.user_pin) {
      return {
        success: false,
        error: new Error('Invalid user_pin'),
      };
    }

    const accessToken = randomUUID();
    const cNonce = randomUUID();
    const expCNonce = Date.now() + 1000 * 60 * 60; // 1 hour
    const exp = Date.now() + 1000 * 60 * 60; // 1 hour

    return {
      success: true,
      data: {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: exp,
        c_nonce: cNonce,
        c_nonce_expires_in: expCNonce,
      },
    };
  }

  public async isValidAuthorizationHeader(args: {
    authorizationHeader: string;
  }): Promise<Result<IsValidAuthorizationHeaderResponse>> {
    const { authorizationHeader } = args;

    // Check if authorization header is present
    if (!authorizationHeader) {
      // Missing authorization header
      return {
        success: false,
        error: new Error('Missing authorization header'),
      };
    }

    // Check header format (Bearer <token>)
    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer') {
      // Invalid header format
      return {
        success: false,
        error: new Error('Invalid authorization header format'),
      };
    }

    // Check if access token is present
    if (!token) {
      // Invalid access token
      return {
        success: false,
        error: new Error('Missing or invalid access token'),
      };
    }

    return {
      success: true,
      data: {
        accessToken: token,
      },
    };
  }

  public async handleCredentialRequest(args: {
    body: CredentialRequest;
  }): Promise<Result<CredentialResponse>> {
    const { format, proof } = body;

    if (!format) {
      throw Error('Missing format');
    }

    // TODO: Check if format is supported ?

    // TODO: We REQUIRE proof for now
    // Later we can implement section 13.2
    // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-13.2
    if (!proof) {
      throw Error('Proof is required');
    }

    // Check proof format
    if (proof.proof_type !== 'jwt') {
      throw Error('Proof format missing or not supported');
    }

    // Check if jwt is present
    if (!proof.jwt) {
      throw Error('Missing or invalid jwt');
    }

    // Decode protected header to get algorithm and key
    let protectedHeader;
    try {
      protectedHeader = decodeProtectedHeader(proof.jwt);
    } catch (e) {
      // FIXME: Maybe we should also include the error message from decodeProtectedHeader
      throw Error('Invalid jwt header');
    }

    // Check if more than 1 is present (kid, jwk, x5c)
    if (
      [protectedHeader.kid, protectedHeader.jwk, protectedHeader.x5c].filter(
        (value) => value != null
      ).length !== 1
    ) {
      const { format, proof } = body;

      if (!format) {
        throw Error('Missing format');
      }

      // TODO: Check if format is supported ?

      // TODO: We REQUIRE proof for now
      // Later we can implement section 13.2
      // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-13.2
      if (!proof) {
        throw Error('Proof is required');
      }

      // Check proof format
      if (proof.proof_type !== 'jwt') {
        throw Error('Proof format missing or not supported');
      }

      // Check if jwt is present
      if (!proof.jwt) {
        throw Error('Missing or invalid jwt');
      }

      // Decode protected header to get algorithm and key
      let protectedHeader;
      try {
        protectedHeader = decodeProtectedHeader(proof.jwt);
      } catch (e) {
        // FIXME: Maybe we should also include the error message from decodeProtectedHeader
        throw Error('Invalid jwt header');
      }

      // Check if more than 1 is present (kid, jwk, x5c)
      if (
        [protectedHeader.kid, protectedHeader.jwk, protectedHeader.x5c].filter(
          (value) => value != null
        ).length !== 1
      ) {
        throw Error('Exactly one of kid, jwk, x5c must be present');
      }

      let payload;
      // Check kid
      if (protectedHeader.kid) {
        // TODO: Resolve kid and use key

        [payload, _] = jwtVerify(proof.jwt, '', {});
      }

      // Check jwk
      if (protectedHeader.jwk) {
        throw Error('Missing or invalid jwt');

        // FIXME: ISS -> Must be client_id
        // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-proof-types

        // TODO: User PIN
      }

      // Check x5c
      // TODO
      if (protectedHeader.x5c) {
        throw Error('x5c not supported');
      }

      // Check if jwt is valid
      const { aud, iss, iat, exp, jti, nbf, sub, nonce } = jwtPayload;

      // Validate signature

      // Check if session contains c_nonce
      if (userSession.c_nonce) {
        // Check if c_nonce is valid
        if (nonce !== userSession.c_nonce) {
          throw Error('Invalid c_nonce');
        }

        // Check if c_nonce is expired
        if (
          userSession.c_nonce_expires_in &&
          userSession.c_nonce_expires_in < Date.now()
        ) {
          throw Error('c_nonce expired');
        }
      }

      // Check audience
      if (aud !== this.configService.get<string>('ISSUER_URL')) {
        throw Error(
          `Invalid audience. Expected: ${this.configService.get<string>(
            'ISSUER_URL'
          )}`
        );
      }

      // FIXME: ISS -> Must be client_id
      // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-proof-types

      // TODO: User PIN
      throw Error('Exactly one of kid, jwk, x5c must be present');
    }

    let payload;
    // Check kid
    if (protectedHeader.kid) {
      // TODO: Resolve kid and use key
      this;
      jwtVerify(proof.jwt, '', {});
    }

    // Check jwk
    if (protectedHeader.jwk) {
      throw Error('jwk not supported');
    }

    // Check x5c
    // TODO
    if (protectedHeader.x5c) {
      throw Error('x5c not supported');
    }

    // Check if jwt is valid
    const { aud, iss, iat, exp, jti, nbf, sub, nonce } = jwtPayload;

    // Validate signature

    // Check if session contains c_nonce
    if (userSession.c_nonce) {
      // Check if c_nonce is valid
      if (nonce !== userSession.c_nonce) {
        throw Error('Invalid c_nonce');
      }

      // Check if c_nonce is expired
      if (
        userSession.c_nonce_expires_in &&
        userSession.c_nonce_expires_in < Date.now()
      ) {
        throw Error('c_nonce expired');
      }
    }

    // Check audience
    if (aud !== this.configService.get<string>('ISSUER_URL')) {
      throw Error(
        `Invalid audience. Expected: ${this.configService.get<string>(
          'ISSUER_URL'
        )}`
      );
    }

    // FIXME: ISS -> Must be client_id
    // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-proof-types

    // TODO: User PIN
    return { success: true, data: undefined };
  }
}

export default OIDCPlugin;
