/* eslint-disable @typescript-eslint/require-await */
import {
  CredentialPayload,
  IAgentPlugin,
  VerifiablePresentation,
} from '@veramo/core';
import {
  extractPublicKeyHex,
  _ExtendedVerificationMethod,
  bytesToBase64url,
} from '@veramo/utils';
import qs from 'qs';
import { randomUUID } from 'crypto';
import {
  AuthorizationRequest,
  CredentialResponse,
  Credentials,
  IssuerServerMetadata,
  PresentationDefinition,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { jwtVerify, decodeProtectedHeader, importJWK } from 'jose';
import { JsonWebKey, VerificationMethod } from 'did-resolver';
import { ec as EC } from 'elliptic';
import { Result } from '../utils';
import {
  CreateCredentialOfferRequestResposne,
  HandleCredentialRequestArgs,
  IPluginConfig,
  IsValidAuthorizationHeaderArgs,
  IsValidAuthorizationHeaderResponse,
  IsValidTokenRequestArgs,
  IsValidTokenRequestResponse,
  HandlePreAuthorizedCodeTokenRequestArgs,
  PrivateKeyToDidResponse,
  HandleAuthorizationResponseArgs,
  CreateCredentialOfferRequestArgs,
  ProofOfPossesionArgs,
  ProofOfPossesionResponseArgs,
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
    createAuthorizationRequest: this.createAuthorizationRequest.bind(this),
    handleAuthorizationResponse: this.handleAuthorizationResponse.bind(this),
    handleIssuerServerMetadataRequest:
      this.handleIssuerServerMetadataRequest.bind(this),
    createCredentialOfferRequest: this.createCredentialOfferRequest.bind(this),
    isValidTokenRequest: this.isValidTokenRequest.bind(this),
    handlePreAuthorizedCodeTokenRequest:
      this.handlePreAuthorizedCodeTokenRequest.bind(this),
    handleCredentialRequest: this.handleCredentialRequest.bind(this),
    isValidAuthorizationHeader: this.isValidAuthorizationHeader.bind(this),
    proofOfPossession: this.proofOfPossession.bind(this),
  };

  // Create Self-Issued OpenID Provider Authorization Request
  // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-10
  public async createAuthorizationRequest(): Promise<Result<string>> {
    // https://identity.foundation/presentation-exchange/
    // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-5

    // TODO: Include either presentation_definition or presentation_definition_uri
    const presentationDefinition: PresentationDefinition = {
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
    };

    const redirectUri = 'https://example.com/redirect'; // Change this to your redirect URI
    const nonce = randomUUID();

    // TODO: Support signed version of request -> client_id needs to be a DID
    // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-8.2.3 - client_metadata
    const authorizationRequest: AuthorizationRequest = {
      response_type: 'vp_token',
      // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-9.2.1
      client_id: redirectUri,
      redirect_uri: redirectUri,
      scope: 'openid',
      nonce,
      presentation_definition: presentationDefinition,
    };

    const params = {
      ...authorizationRequest,
      presentation_definition: JSON.stringify(
        authorizationRequest.presentation_definition
      ),
    };

    // TODO: Redirect handling
    return {
      success: true,
      data: `openid://?${qs.stringify(params)}`,
    };
  }

  public async handleAuthorizationResponse(
    args: HandleAuthorizationResponseArgs,
    context: OIDCAgentContext
  ): Promise<Result<boolean>> {
    // FIXME: Token response ???
    // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-6.1-2.3.1

    const {
      contentTypeHeader,
      body,
      c_nonce: cNonce,
      c_nonce_expires_in: cNonceExpiresIn,
    } = args;
    // Response needs to include `Content-Type` header with value `application/x-www-form-urlencoded`
    // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-11.2
    if (
      !contentTypeHeader
        .toLowerCase()
        .includes('application/x-www-form-urlencoded')
    ) {
      return {
        success: false,
        error: new Error(`Invalid content type header: ${contentTypeHeader}`),
      };
    }

    if (!body.id_token && !body.vp_token) {
      return {
        success: false,
        error: new Error('No token present in response'),
      };
    }

    const {
      id_token: idToken,
      vp_token: vpToken,
      presentation_submission: presentationSubmission,
    } = body;

    if (idToken) {
      // TODO: Validate id_token
    }

    if (vpToken) {
      // If vp_token is present, then presentation_definition must be present
      if (!presentationSubmission) {
        return {
          success: false,
          error: new Error(
            'presentation_submission must be present if vp_token is present'
          ),
        };
      }

      // TODO: Handle presentation_submission

      // Decode protected header to get algorithm and key
      let protectedHeader;
      try {
        protectedHeader = decodeProtectedHeader(vpToken);
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
        return {
          success: false,
          error: new Error('Exactly one of kid, jwk, x5c must be present'),
        };
      }

      let payload;
      let publicKey;
      let did;

      // Check kid
      if (protectedHeader.kid) {
        // Split kid
        const [extractedDid, extractedKeyId] = protectedHeader.kid.split('#');
        did = extractedDid;

        // Check if did and keyId are present
        if (!did || !extractedKeyId) {
          return {
            success: false,
            error: new Error('Invalid kid'),
          };
        }

        const resolvedDid = await context.agent.resolveDid({ didUrl: did });
        if (
          resolvedDid.didResolutionMetadata.error ||
          !resolvedDid.didDocument
        ) {
          return {
            success: false,
            error: new Error(
              `Error resolving did. Reason: ${
                resolvedDid.didResolutionMetadata.error ?? 'Unknown error'
              }`
            ),
          };
        }

        let fragment;

        try {
          fragment = (await context.agent.getDIDComponentById({
            didDocument: resolvedDid.didDocument,
            didUrl: protectedHeader.kid,
            section: 'authentication',
          })) as VerificationMethod;
        } catch (e) {
          return {
            success: false,
            error: new Error('Invalid kid'),
          };
        }

        if (fragment.publicKeyJwk) {
          return {
            success: false,
            error: new Error('PublickKeyJwk not supported yet!'),
          };
        }
        const publicKeyHex = extractPublicKeyHex(
          fragment as _ExtendedVerificationMethod
        );

        if (publicKeyHex === '') {
          return {
            success: false,
            error: new Error('Invalid kid or no public key present'),
          };
        }

        const supportedTypes = ['EcdsaSecp256k1VerificationKey2019'];
        if (!supportedTypes.includes(fragment.type)) {
          return {
            success: false,
            error: new Error('Unsupported key type'),
          };
        }

        let ctx: EC;
        let curveName: string;

        if (fragment.type === 'EcdsaSecp256k1VerificationKey2019') {
          ctx = new EC('secp256k1');
          curveName = 'secp256k1';
        } else {
          return {
            success: false,
            error: new Error('Unsupported key type'),
          };
        }
        const pubPoint = ctx.keyFromPublic(publicKeyHex, 'hex').getPublic();
        const publicKeyJwk: JsonWebKey = {
          kty: 'EC',
          crv: curveName,
          x: bytesToBase64url(pubPoint.getX().toBuffer('be', 32)),
          y: bytesToBase64url(pubPoint.getY().toBuffer('be', 32)),
        };

        publicKey = await importJWK(publicKeyJwk, protectedHeader.alg);
      } else if (protectedHeader.jwk) {
        publicKey = await importJWK(protectedHeader.jwk);
      } else if (protectedHeader.x5c) {
        return {
          success: false,
          error: new Error('x5c not supported'),
        };
      } else {
        // Should never happen (here for type safety)
        return {
          success: false,
          error: new Error('Invalid jwt header'),
        };
      }

      try {
        payload = (
          await jwtVerify(vpToken, publicKey, {
            issuer: did, // TODO: Does the issuer need to be the did?
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

      // Check if jwt is valid (we already checked the audiance and issuer)
      const { exp, nbf, nonce } = payload;

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
      }

      if (exp && 1000 * exp < Date.now()) {
        return {
          success: false,
          error: new Error('Jwt expired'),
        };
      }

      if (nbf && 1000 * nbf > Date.now()) {
        return {
          success: false,
          error: new Error('Jwt not valid yet'),
        };
      }

      // Verify vp
      const vp = payload.vp as VerifiablePresentation;

      // TODO: Do we need to support challenge and domain?
      const verified = await context.agent.verifyPresentation({
        presentation: vp,
      });

      if (!verified.verified) {
        return {
          success: false,
          error: new Error(
            `Invalid vp. Reason: ${verified.error?.message ?? 'Unknown error'}`
          ),
        };
      }

      // TODO: Check if vp contains the correct type

      // TODO: Check if vp contains the correct context

      // Check if vp contains atleast one credential
      if (!vp.verifiableCredential) {
        return {
          success: false,
          error: new Error('No credentials in vp'),
        };
      }
      // Verify all credentials
      const verificationResults = await Promise.all(
        vp.verifiableCredential.map(
          // FIXME: Do we need to decode if in jwt format?
          async (vc) =>
            context.agent.verifyCredential({
              credential: vc,
            })
        )
      );

      // Check if all credentials are valid
      const invalidCredentials = verificationResults.filter(
        (result) => !result.verified
      );

      if (invalidCredentials.length > 0) {
        return {
          success: false,
          error: new Error(
            `Atleast one credential is invalid. Reason: ${
              invalidCredentials[0].error?.message ?? 'Unknown error'
            }`
          ),
        };
      }

      return {
        success: true,
        data: true,
      };
    }

    return {
      success: false,
      error: new Error('Invalid jwt'),
    };
  }

  public async handleIssuerServerMetadataRequest(): Promise<
    Result<IssuerServerMetadata>
  > {
    const exampleMetadata = {
      credential_issuer: this.pluginConfig.url,
      issuer: this.pluginConfig.url,
      authorization_endpoint: '',
      token_endpoint: `${this.pluginConfig.url}/token`,
      credential_endpoint: `${this.pluginConfig.url}/credential`,
      response_types_supported: [
        'code',
        'id_token',
        'id_token token',
        'code id_token',
        'code token',
        'code id_token token',
      ],
      credentials_supported: this.pluginConfig.supported_credentials,
    };

    return { success: true, data: exampleMetadata };
  }

  public async createCredentialOfferRequest(
    args: CreateCredentialOfferRequestArgs
  ): Promise<Result<CreateCredentialOfferRequestResposne>> {
    const { schema, grants: requestedGrants, userPinRequired } = args;
    const supportedCredentialSchemas =
      this.pluginConfig.supported_credentials.map(
        (credential) => credential.schema
      );

    if (!supportedCredentialSchemas.includes(schema)) {
      return {
        success: false,
        error: new Error(`Unsupported credential schema: ${schema}`),
      };
    }

    // Currently only array of schema (ids) is supported
    const credentials: Credentials = [schema];
    const preAuthorizedCode = randomUUID();
    const userPin = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 10)
    )
      .map(String)
      .join('');

    const preAuthorizedCodeIncluded = requestedGrants?.includes(
      'urn:ietf:params:oauth:grant-type:pre-authorized_code'
    );

    // TODO: How to handle the case where `grants` is undefined?
    // In this case the Wallet MUST determine the Grant Types
    // the Credential Issuer's AS supports using the respective metadata
    const params = {
      credential_issuer: this.pluginConfig.url,
      credentials,
      ...(requestedGrants && {
        grants: {
          ...(requestedGrants.includes('authorization_code') && {
            authorization_code: {
              // FIXME: QS removes empty objects, thats why we need to add a placeholder
              issuer_state: 'placeholder', // Here we could add `issuer_state`
            },
          }),
          ...(preAuthorizedCodeIncluded && {
            'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
              'pre-authorized_code': preAuthorizedCode,
              ...(userPinRequired && { user_pin_required: userPinRequired }),
            },
          }),
        },
      }),
    };

    return {
      success: true,
      data: {
        credentialOfferRequest: `openid_credential_offer://credential_offer?${qs.stringify(
          params
        )}`,
        credentials,
        ...(preAuthorizedCodeIncluded && { preAuthorizedCode }),
        ...(userPinRequired && { userPin }),
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
      return {
        success: false,
        error: new Error('Grant type authorization_code not implemented'),
      };
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
    const { body, preAuthorizedCode, userPin, overrides } = args;
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
        error: new Error('Invalid or missing user_pin'),
      };
    }

    const accessToken = overrides?.accessToken ?? randomUUID();
    const cNonce = overrides?.cNonce ?? randomUUID();
    const expCNonce =
      Date.now() + (overrides?.cNonceExpiresIn ?? 1000 * 60 * 60); // 1 hour default
    const exp =
      Date.now() + (overrides?.accessTokenExpiresIn ?? 1000 * 60 * 60); // 1 hour default

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
    const { body, issuerDid, subjectDid, credentialSubjectClaims } = args;
    const { format, schema, types } = body;

    if (!format) {
      return {
        success: false,
        error: new Error('Missing format'),
      };
    }

    if (types) {
      return {
        success: false,
        error: new Error('Types not supported yet. Use schema instead.'),
      };
    }

    if (!schema) {
      return {
        success: false,
        error: new Error('Missing schema'),
      };
    }

    const supportedCredential = this.pluginConfig.supported_credentials.find(
      (cred) => cred.schema === schema
    );

    // Check if schema is supported
    if (!supportedCredential) {
      return {
        success: false,
        error: new Error('Unsupported schema'),
      };
    }

    if (!issuerDid) {
      return {
        success: false,
        error: new Error('Missing issuer did'),
      };
    }

    if (!subjectDid) {
      return {
        success: false,
        error: new Error('Missing subject did'),
      };
    }

    // Check if format is supported for this schema
    if (supportedCredential.format !== format) {
      return {
        success: false,
        error: new Error(
          `Unsupported format. Supported format ${supportedCredential.format}.`
        ),
      };
    }

    // FIXME: ISS -> Must be client_id
    // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-proof-types
    let credentialPayload: CredentialPayload;

    try {
      // Build credential payload
      credentialPayload = {
        issuer: { id: issuerDid },
        // FIXME: Add credential status ? (https://www.w3.org/TR/vc-data-model/#status)
        // FIXME: Type field is required, but we are using the crentialSchema field which is optional
        credentialSchema: {
          id: schema,
          type: 'JsonSchemaValidator2018', // TODO: We are not actually using this at the moment
        },
        credentialSubject: {
          id: subjectDid,
          ...(credentialSubjectClaims as object), // TODO: VALIDATE CLAIMS AGAINST SCHEMA
        },
      };
    } catch (e: any) {
      return {
        success: false,
        error: new Error('Error building credential payload'),
      };
    }
    let credential;

    // Create credential from payload
    try {
      credential = await context.agent.createVerifiableCredential({
        credential: credentialPayload,
        proofFormat: 'jwt',
      });
    } catch (e) {
      return {
        success: false,
        error: new Error('Error creating credential'),
      };
    }

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

  public static async privateKeyToDid(
    privateKey: string,
    didMethod: string
  ): Promise<Result<PrivateKeyToDidResponse>> {
    const ctx = new EC('secp256k1');
    const ecPrivateKey = ctx.keyFromPrivate(privateKey);
    const compactPublicKey = `0x${ecPrivateKey.getPublic(true, 'hex')}`;
    const did = `${didMethod}:${compactPublicKey}`;

    return {
      success: true,
      data: {
        did,
      },
    };
  }

  public async proofOfPossession(
    args: ProofOfPossesionArgs,
    context: OIDCAgentContext
  ): Promise<Result<ProofOfPossesionResponseArgs>> {
    const { proof, cNonce, cNonceExpiresIn } = args;

    if (!proof) {
      // TODO: We REQUIRE proof for now
      // Later we can implement section 13.2
      // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-13.2
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
      return {
        success: false,
        error: new Error('Exactly one of kid, jwk, x5c must be present'),
      };
    }

    let payload;
    let publicKey;
    let did;

    if (protectedHeader.typ !== 'openid4vci-proof+jwt') {
      return {
        success: false,
        error: new Error(
          `Invalid JWT typ. Expected "openid4vci-proof+jwt" but got "${
            protectedHeader.typ ?? 'undefined'
          }"`
        ),
      };
    }

    // Check kid
    if (protectedHeader.kid) {
      // Split kid
      const [extractedDid, extractedKeyId] = protectedHeader.kid.split('#');
      did = extractedDid;

      // Check if did and keyId are present
      if (!did || !extractedKeyId) {
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
            `Error resolving did. Reason: ${
              resolvedDid.didResolutionMetadata.error ?? 'Unknown error'
            }`
          ),
        };
      }

      let fragment;

      try {
        fragment = (await context.agent.getDIDComponentById({
          didDocument: resolvedDid.didDocument,
          didUrl: protectedHeader.kid,
          section: 'authentication',
        })) as VerificationMethod;
      } catch (e) {
        return {
          success: false,
          error: new Error('Invalid kid'),
        };
      }

      if (fragment.publicKeyJwk) {
        return {
          success: false,
          error: new Error('PublickKeyJwk not supported yet!'),
        };
      }
      const publicKeyHex = extractPublicKeyHex(
        fragment as _ExtendedVerificationMethod
      );

      if (publicKeyHex === '') {
        return {
          success: false,
          error: new Error('Invalid kid or no public key present'),
        };
      }

      const supportedTypes = ['EcdsaSecp256k1VerificationKey2019'];
      if (!supportedTypes.includes(fragment.type)) {
        return {
          success: false,
          error: new Error('Unsupported key type'),
        };
      }

      let ctx: EC;
      let curveName: string;

      if (fragment.type === 'EcdsaSecp256k1VerificationKey2019') {
        ctx = new EC('secp256k1');
        curveName = 'secp256k1';
      } else {
        return {
          success: false,
          error: new Error('Unsupported key type'),
        };
      }
      const pubPoint = ctx.keyFromPublic(publicKeyHex, 'hex').getPublic();
      const publicKeyJwk: JsonWebKey = {
        kty: 'EC',
        crv: curveName,
        x: bytesToBase64url(pubPoint.getX().toBuffer('be', 32)),
        y: bytesToBase64url(pubPoint.getY().toBuffer('be', 32)),
      };

      publicKey = await importJWK(publicKeyJwk, protectedHeader.alg);
    } else if (protectedHeader.jwk) {
      // publicKey = await importJWK(protectedHeader.jwk);
      return {
        success: false,
        error: new Error('jwk not supported'),
      };
    } else if (protectedHeader.x5c) {
      return {
        success: false,
        error: new Error('x5c not supported'),
      };
    } else {
      // Should never happen (here for type safety)
      return {
        success: false,
        error: new Error('Invalid jwt header'),
      };
    }

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
    const { exp, nbf, nonce } = payload;

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
    }

    if (exp && 1000 * exp < Date.now()) {
      return {
        success: false,
        error: new Error('Jwt expired'),
      };
    }

    if (nbf && 1000 * nbf > Date.now()) {
      return {
        success: false,
        error: new Error('Jwt not valid yet'),
      };
    }

    return {
      success: true,
      data: {
        did,
      },
    };
  }
}

export default OIDCPlugin;
