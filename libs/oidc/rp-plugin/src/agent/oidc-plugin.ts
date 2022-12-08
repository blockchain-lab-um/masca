import { CredentialPayload, IAgentPlugin } from '@veramo/core';
import qs from 'qs';
import { randomUUID } from 'crypto';
import {
  CredentialResponse,
  Credentials,
  IssuanceRequestParams,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { Result } from 'src/utils';
import { jwtVerify, decodeProtectedHeader, importJWK, JWTPayload } from 'jose';
import { VerificationMethod } from 'did-resolver';
import {
  Claims,
  CreateIssuanceInitiationRequestResposne,
  HandleCredentialRequestArgs,
  IPluginConfig,
  IsValidAuthorizationHeaderArgs,
  IsValidAuthorizationHeaderResponse,
  IsValidTokenRequestArgs,
  IsValidTokenRequestResponse,
  HandlePreAuthorizedCodeTokenRequestArgs,
} from '../types/internal';
import { IOIDCPlugin, OIDCAgentContext } from '../types/IOIDCPlugin';

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
    Result<CreateIssuanceInitiationRequestResposne>
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
  public async isValidTokenRequest(
    args: IsValidTokenRequestArgs
  ): Promise<Result<IsValidTokenRequestResponse>> {
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
  public async handlePreAuthorizedCodeTokenRequest(
    args: HandlePreAuthorizedCodeTokenRequestArgs
  ): Promise<Result<TokenResponse>> {
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

  public async isValidAuthorizationHeader(
    args: IsValidAuthorizationHeaderArgs
  ): Promise<Result<IsValidAuthorizationHeaderResponse>> {
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

  public async handleCredentialRequest(
    args: HandleCredentialRequestArgs,
    context: OIDCAgentContext
  ): Promise<Result<CredentialResponse>> {
    const { body, c_nonce: cNonce, c_nonce_expires_in: cNonceExpiresIn } = args;
    const { format, proof } = body;

    if (!format) {
      return {
        success: false,
        error: new Error('Missing format'),
      };
    }

    // TODO: Check if format is supported ?

    // TODO: We REQUIRE proof for now
    // Later we can implement section 13.2
    // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-13.2
    if (!proof) {
      // TODO: Return according to specs
      // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-8.3.2
      return {
        success: false,
        error: new Error('Proof is required'),
      };
    }

    // Check proof format
    if (proof.proof_type !== 'jwt') {
      return {
        success: false,
        error: new Error('Proof format missing or not supported'),
      };
    }

    // Check if jwt is present
    if (!proof.jwt) {
      return {
        success: false,
        error: new Error('Missing or invalid jwt'),
      };
    }

    // Decode protected header to get algorithm and key
    let protectedHeader;
    try {
      protectedHeader = decodeProtectedHeader(proof.jwt);
    } catch (e) {
      // FIXME: Maybe we should also include the error message from decodeProtectedHeader
      return {
        success: false,
        error: new Error('Invalid jwt header'),
      };
    }

    // Check if more than 1 is present (kid, jwk, x5c)
    if (
      [protectedHeader.kid, protectedHeader.jwk, protectedHeader.x5c].filter(
        (value) => value != null
      ).length !== 1
    ) {
      // Check if more than 1 is present (kid, jwk, x5c)
      if (
        [protectedHeader.kid, protectedHeader.jwk, protectedHeader.x5c].filter(
          (value) => value != null
        ).length !== 1
      ) {
        return {
          success: false,
          error: new Error('Exactly one of kid, jwk, x5c must be present'),
        };
      }
    }

    let payload;

    // Check kid
    if (protectedHeader.kid) {
      // TODO: Resolve kid and use key

      // Split kid
      const [did, keyId] = protectedHeader.kid.split('#');

      // Check if did and keyId are present
      if (!did || !keyId) {
        return {
          success: false,
          error: new Error('Invalid kid'),
        };
      }

      const resolvedDid = await context.agent.resolveDid({ didUrl: did });

      if (resolvedDid.didResolutionMetadata.error || !resolvedDid.didDocument) {
        return {
          success: false,
          error: new Error(
            `Error resolving did: ${resolvedDid.didResolutionMetadata.error}`
          ),
        };
      }

      let fragment;

      try {
        fragment = await context.agent.getDIDComponentById({
          didDocument: resolvedDid.didDocument,
          didUrl: keyId,
          section: 'authentication',
        });
      } catch (e) {
        console.error(e);
        return {
          success: false,
          error: new Error('Invalid kid'),
        };
      }
      const { publicKeyJwk } = fragment as VerificationMethod;

      if (!publicKeyJwk) {
        return {
          success: false,
          error: new Error('Invalid kid or publicKeyJwk not present'),
        };
      }

      const publicKey = await importJWK(publicKeyJwk);

      try {
        payload = (
          await jwtVerify(proof.jwt, publicKey, {
            // TODO: Maybe check ISS here ?
            audience: this.pluginConfig.url,
          })
        ).payload;
      } catch {
        // TODO: Error and new nonce ?
        // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-8.3.2
        return {
          success: false,
          error: new Error('Invalid jwt'),
        };
      }

      // Check if jwt is valid
      const { exp, nbf, nonce } = payload as JWTPayload;

      // Check if session contains cNonce
      if (cNonce) {
        // Check if nonce is valid
        if (nonce !== cNonce) {
          return {
            success: false,
            error: new Error('Invalid c_nonce'),
          };
        }

        // Check if cNonce is expired
        if (cNonceExpiresIn && cNonceExpiresIn < Date.now()) {
          return {
            success: false,
            error: new Error('c_nonce expired'),
          };
        }

        if (exp && exp < Date.now()) {
          return {
            success: false,
            error: new Error('Invalid jwt'),
          };
        }

        if (nbf && nbf > Date.now()) {
          return {
            success: false,
            error: new Error('Invalid jwt'),
          };
        }

        // FIXME: ISS -> Must be client_id
        // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-proof-types

        // Build credential payload
        const credentialPayload: CredentialPayload = {
          // FIXME: Replace with issuer DID
          issuer: { id: this.pluginConfig.url },
          // FIXME: Add credential status ? (https://www.w3.org/TR/vc-data-model/#status)
          // FIXME: Set correct type
          type: ['VerifiableCredential'],
          credentialSubject: {
            id: did,
          },
        };

        // Create credential from payload
        const credential = await context.agent.createVerifiableCredential({
          credential: credentialPayload,
          proofFormat: 'jwt',
        });

        // FIXME: Why would we need to send c_nonce ?
        // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-8.3
        return {
          success: true,
          data: {
            format: 'jwt_vc_json',
            credential: credential.proof.jwt as string,
          },
        };
      }

      // const credential = await context.agent.createVerifiableCredential({
    }

    // Check jwk
    if (protectedHeader.jwk) {
      return {
        success: false,
        error: new Error('jwk not supported'),
      };
    }

    // Check x5c
    // TODO
    if (protectedHeader.x5c) {
      return {
        success: false,
        error: new Error('x5c not supported'),
      };
    }

    // TODO: Should never happen
    return {
      success: false,
      error: new Error('Error'),
    };
  }
}

export default OIDCPlugin;
