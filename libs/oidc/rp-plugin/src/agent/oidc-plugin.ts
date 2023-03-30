import { randomUUID } from 'crypto';
import {
  AuthorizationRequest,
  CredentialResponse,
  Credentials,
  IssuerServerMetadata,
  TOKEN_ERRORS,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import {
  CredentialPayload,
  IAgentPlugin,
  VerifiablePresentation,
} from '@veramo/core';
import {
  _ExtendedVerificationMethod,
  bytesToBase64url,
  extractPublicKeyHex,
} from '@veramo/utils';
// Uncomment these lines when implementing schema validation
// import _Ajv from 'ajv';
// import _addFormats from 'ajv-formats';
import { JsonWebKey, VerificationMethod } from 'did-resolver';
import elliptic from 'elliptic';
import {
  JWK,
  calculateJwkThumbprint,
  decodeJwt,
  decodeProtectedHeader,
  importJWK,
  jwtVerify,
} from 'jose';
import qs from 'qs';

import { IOIDCPlugin, OIDCAgentContext } from '../types/IOIDCPlugin.js';
import {
  CreateAuthorizationRequestArgs,
  CreateAuthorizationRequestResponse,
  CreateCredentialOfferRequestArgs,
  CreateCredentialOfferRequestResposne,
  HandleAuthorizationResponseArgs,
  HandleCredentialRequestArgs,
  HandlePreAuthorizedCodeTokenRequestArgs,
  IPluginConfig,
  IsValidTokenRequestArgs,
  IsValidTokenRequestResponse,
  ProofOfPossesionArgs,
  ProofOfPossesionResponseArgs,
} from '../types/internal.js';
import DetailedError from '../utils/detailedError.js';
import { Result } from '../utils/index.js';

const { ec: EC } = elliptic;
// const Ajv = _Ajv as unknown as typeof _Ajv.default;
// const addFormats = _addFormats as unknown as typeof _addFormats.default;

const compareTypes = (first: string[], second: string[]) =>
  first.length === second.length && first.every((ele, i) => ele === second[i]);

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
    proofOfPossession: this.proofOfPossession.bind(this),
  };

  // Create Self-Issued OpenID Provider Authorization Request
  // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-10
  public async createAuthorizationRequest(
    args: CreateAuthorizationRequestArgs
  ): Promise<Result<CreateAuthorizationRequestResponse>> {
    // https://identity.foundation/presentation-exchange/
    // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-5

    // TODO: Add support for presentation_definition_uri
    const { presentationDefinition, clientId, redirectUri, state, overrides } =
      args;

    const nonce = overrides?.nonce ?? randomUUID();
    const nonceExpiresIn =
      Date.now() + (overrides?.nonceExpiresIn ?? 1000 * 60 * 60); // 1 hour default

    // TODO: Support signed version of request -> client_id needs to be a DID
    // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-8.2.3 - client_metadata
    // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-9.2.1

    const authorizationRequest: AuthorizationRequest = {
      scope: 'openid',
      response_type: 'vp_token id_token',
      // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-a.4
      id_token_type: 'subject_signed',
      client_id: clientId,
      redirect_uri: redirectUri,
      nonce,
      presentation_definition: presentationDefinition,
      state,
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
      data: {
        authorizationRequest: `openid://?${qs.stringify(params)}`,
        nonce,
        nonceExpiresIn,
      },
    };
  }

  public async handleAuthorizationResponse(
    args: HandleAuthorizationResponseArgs,
    context: OIDCAgentContext
  ): Promise<Result<boolean>> {
    const { body, nonce: cNonce, nonceExpiresIn: cNonceExpiresIn } = args;

    const {
      id_token: idToken,
      vp_token: vpToken,
      presentation_submission: presentationSubmission,
    } = body;

    if (!idToken) {
      return {
        success: false,
        error: new DetailedError('', 'id_token must be present'),
      };
    }

    if (!vpToken) {
      return {
        success: false,
        error: new DetailedError('', 'vp_token must be present'),
      };
    }

    if (!presentationSubmission) {
      return {
        success: false,
        error: new DetailedError('', 'presentation_submission must be present'),
      };
    }
    // TODO: Handle presentation_submission

    let protectedHeader;

    // Decode id_token
    // https://openid.bitbucket.io/connect/openid-connect-self-issued-v2-1_0.html#section-6.1-6.8.1
    // Self-Issued ID Token Validation:
    // https://openid.bitbucket.io/connect/openid-connect-self-issued-v2-1_0.html#section-11.1
    try {
      protectedHeader = decodeProtectedHeader(idToken);
    } catch (e) {
      return {
        success: false,
        error: new DetailedError('', 'Invalid id_token jwt header'),
      };
    }

    let payload;
    let publicKey;
    let fragment;
    let resolvedDid;
    let ctx: elliptic.ec;
    let curveName: string;
    let publicKeyHex;

    // TODO: Check if method supported
    // Decode payload
    try {
      payload = decodeJwt(idToken);
    } catch (e) {
      return {
        success: false,
        error: new DetailedError('', 'Invalid id_token jwt payload'),
      };
    }

    // Check iss and sub are equal
    if (!payload.iss || !payload.sub || payload.iss !== payload.sub) {
      return {
        success: false,
        error: new DetailedError('', 'id_token iss and sub must be equal'),
      };
    }

    // Check exp
    if (payload.exp && 1000 * payload.exp < Date.now()) {
      return {
        success: false,
        error: new DetailedError('', 'id_token expired'),
      };
    }

    // Check nbf
    if (payload.nbf && 1000 * payload.nbf > Date.now()) {
      return {
        success: false,
        error: new DetailedError('', 'id_token not valid yet'),
      };
    }

    // Check audience
    if (!payload.aud || payload.aud !== this.pluginConfig.url) {
      return {
        success: false,
        error: new DetailedError(
          '',
          `id_token audience is invalid. Must be ${this.pluginConfig.url}`
        ),
      };
    }

    // nonce is checked twice for id_token and vp_token
    // Check if session contains nonce
    if (cNonce) {
      // Check if nonce is valid
      if (payload.nonce !== cNonce) {
        return {
          success: false,
          error: new DetailedError('', 'Invalid nonce'),
        };
      }

      // Check if nonce is expired
      if (cNonceExpiresIn && cNonceExpiresIn < Date.now()) {
        return {
          success: false,
          error: new DetailedError('', 'Nonce expired'),
        };
      }
    }

    // id_token was signed with a DID
    if (payload.iss.startsWith('did')) {
      if (payload.sub_jwk) {
        return {
          success: false,
          error: new DetailedError(
            '',
            'id_token must not contain sub_jwk when signed with DID'
          ),
        };
      }

      if (!protectedHeader.kid) {
        return {
          success: false,
          error: new DetailedError(
            '',
            'id_token must contain kid in header when signed with DID'
          ),
        };
      }

      resolvedDid = await context.agent.resolveDid({ didUrl: payload.iss });
      if (resolvedDid.didResolutionMetadata.error || !resolvedDid.didDocument) {
        return {
          success: false,
          error: new DetailedError(
            '',
            `DetailedError resolving did. Reason: ${
              resolvedDid.didResolutionMetadata.error ?? 'Unknown error'
            }`
          ),
        };
      }

      try {
        fragment = (await context.agent.getDIDComponentById({
          didDocument: resolvedDid.didDocument,
          didUrl: protectedHeader.kid,
          section: 'authentication',
        })) as VerificationMethod;
      } catch (e) {
        return {
          success: false,
          error: new DetailedError('', 'Invalid kid'),
        };
      }

      // TODO: Can we remove this and it will work ?
      if (fragment.publicKeyJwk) {
        return {
          success: false,
          error: new DetailedError('', 'PublicKeyJwk not supported yet!'),
        };
      }

      publicKeyHex = extractPublicKeyHex(
        fragment as _ExtendedVerificationMethod
      );

      if (publicKeyHex === '') {
        return {
          success: false,
          error: new DetailedError('', 'Invalid kid or no public key present'),
        };
      }

      const supportedTypes = ['EcdsaSecp256k1VerificationKey2019'];
      if (!supportedTypes.includes(fragment.type)) {
        return {
          success: false,
          error: new DetailedError('', 'Unsupported key type'),
        };
      }

      if (fragment.type === 'EcdsaSecp256k1VerificationKey2019') {
        ctx = new EC('secp256k1');
        curveName = 'secp256k1';
      } else {
        return {
          success: false,
          error: new DetailedError('', 'Unsupported key type'),
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
    } else {
      // id_token was signed with a JWK

      // TODO: Check id_token_signing_alg_values_supported
      if (!payload.sub_jwk) {
        return {
          success: false,
          error: new DetailedError(
            '',
            'id_token must contain sub_jwk when signed with JWK'
          ),
        };
      }

      // Check if jwk thumbprint
      const jwkThumbprint = await calculateJwkThumbprint(
        payload.sub_jwk as JWK
      );

      if (jwkThumbprint !== payload.sub) {
        return {
          success: false,
          error: new DetailedError(
            '',
            'id_token sub does not match sub_jwk thumbprint'
          ),
        };
      }

      publicKey = await importJWK(payload.sub_jwk as JWK);
    }

    // Verify signature
    try {
      await jwtVerify(idToken, publicKey, {
        audience: this.pluginConfig.url,
      });
    } catch (e) {
      return {
        success: false,
        error: new DetailedError('', 'id_token signature invalid'),
      };
    }

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
          error: new DetailedError('', 'Invalid kid'),
        };
      }

      resolvedDid = await context.agent.resolveDid({ didUrl: did });
      if (resolvedDid.didResolutionMetadata.error || !resolvedDid.didDocument) {
        return {
          success: false,
          error: new DetailedError(
            '',
            `DetailedError resolving did. Reason: ${
              resolvedDid.didResolutionMetadata.error ?? 'Unknown error'
            }`
          ),
        };
      }

      try {
        fragment = (await context.agent.getDIDComponentById({
          didDocument: resolvedDid.didDocument,
          didUrl: protectedHeader.kid,
          section: 'authentication',
        })) as VerificationMethod;
      } catch (e) {
        return {
          success: false,
          error: new DetailedError('', 'Invalid kid'),
        };
      }

      // TODO: Can we remove this and it will work ?
      if (fragment.publicKeyJwk) {
        return {
          success: false,
          error: new DetailedError('', 'PublicKeyJwk not supported yet!'),
        };
      }

      publicKeyHex = extractPublicKeyHex(
        fragment as _ExtendedVerificationMethod
      );

      if (publicKeyHex === '') {
        return {
          success: false,
          error: new DetailedError('', 'Invalid kid or no public key present'),
        };
      }

      const supportedTypes = ['EcdsaSecp256k1VerificationKey2019'];
      if (!supportedTypes.includes(fragment.type)) {
        return {
          success: false,
          error: new DetailedError('', 'Unsupported key type'),
        };
      }

      if (fragment.type === 'EcdsaSecp256k1VerificationKey2019') {
        ctx = new EC('secp256k1');
        curveName = 'secp256k1';
      } else {
        return {
          success: false,
          error: new DetailedError('', 'Unsupported key type'),
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
        error: new DetailedError('', 'x5c not supported'),
      };
    } else {
      // Should never happen (here for type safety)
      return {
        success: false,
        error: new DetailedError('', 'Invalid jwt header'),
      };
    }

    try {
      payload = (
        await jwtVerify(vpToken, publicKey, {
          issuer: did,
          audience: this.pluginConfig.url,
        })
      ).payload;
    } catch {
      // TODO: DetailedError and new nonce ?
      // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-8.3.2
      return {
        success: false,
        error: new DetailedError('', 'Invalid jwt'),
      };
    }

    // Check if jwt is valid (we already checked the audiance and issuer)
    const { exp, nbf, nonce } = payload;

    // Check if session contains nonce
    if (cNonce) {
      // Check if nonce is valid
      if (nonce !== cNonce) {
        return {
          success: false,
          error: new DetailedError('', 'Invalid nonce'),
        };
      }

      // Check if nonce is expired
      if (cNonceExpiresIn && cNonceExpiresIn < Date.now()) {
        return {
          success: false,
          error: new DetailedError('', 'Nonce expired'),
        };
      }
    }

    if (exp && 1000 * exp < Date.now()) {
      return {
        success: false,
        error: new DetailedError('', 'Jwt expired'),
      };
    }

    if (nbf && 1000 * nbf > Date.now()) {
      return {
        success: false,
        error: new DetailedError('', 'Jwt not valid yet'),
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
        error: new DetailedError(
          '',
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
        error: new DetailedError('', 'No credentials in vp'),
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
        error: new DetailedError(
          '',
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
    const {
      credentials: requestedCredentials,
      grants: requestedGrants,
      userPinRequired,
    } = args;

    // Check if requested credentials are valid
    if (
      !Array.isArray(requestedCredentials) ||
      !requestedCredentials.every(
        (credential) =>
          typeof credential === 'string' ||
          (typeof credential === 'object' && credential !== null)
      )
    ) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'Requested invalid credentials.'
        ),
      };
    }

    const credentials: Credentials = [];

    // Check if requested credentials are supported
    requestedCredentials.forEach((credential) => {
      for (const supportedCredential of this.pluginConfig
        .supported_credentials) {
        // If credential is a string, check if it is equal to the supported credential id
        if (typeof credential === 'string') {
          if (credential === supportedCredential.id) {
            credentials.push(credential);
            break;
          }
        }
        // Check msso_mdoc format
        else if (credential.format === 'mso_mdoc') {
          if (
            supportedCredential.format === 'mso_mdoc' &&
            credential.doctype === supportedCredential.doctype
          ) {
            credentials.push({
              format: supportedCredential.format,
              doctype: supportedCredential.doctype,
            });
            break;
          }
        } else if (credential.format === supportedCredential.format) {
          if (compareTypes(credential.types, supportedCredential.types)) {
            credentials.push({
              format: supportedCredential.format,
              types: supportedCredential.types,
            });
            break;
          }
        }
      }
    });

    if (credentials.length === 0) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'No supported credentials found.'
        ),
      };
    }

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
        credentialOfferRequest: `openid_credential_offer://credential_offer?${encodeURIComponent(
          JSON.stringify(params)
        )}`,
        credentials,
        ...(preAuthorizedCodeIncluded && { preAuthorizedCode }),
        ...(userPinRequired && { userPin }),
      },
    };
  }

  public async isValidTokenRequest(
    args: IsValidTokenRequestArgs
  ): Promise<Result<IsValidTokenRequestResponse>> {
    const { body } = args;

    if (body.grant_type === 'authorization_code') {
      return {
        success: false,
        error: new DetailedError(
          'unsupported_grant_type',
          TOKEN_ERRORS.unsupported_grant_type
        ),
      };
    }

    if (
      body.grant_type === 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
    ) {
      if (!body['pre-authorized_code']) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            'Invalid or missing pre-authorized_code.'
            // TODO: Those this error need have status code 401?
          ),
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
      error: new DetailedError(
        'unsupported_grant_type',
        TOKEN_ERRORS.unsupported_grant_type
      ),
    };
  }

  public async handlePreAuthorizedCodeTokenRequest(
    args: HandlePreAuthorizedCodeTokenRequestArgs
  ): Promise<Result<TokenResponse>> {
    const { body, preAuthorizedCode, userPin, overrides } = args;
    // FIXME - Split authorization_code and pre-authorized_code

    if (body['pre-authorized_code'] !== preAuthorizedCode) {
      // TODO: Implement
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'Invalid or missing pre-authorized_code.'
        ),
      };
    }

    if (userPin && userPin !== body.user_pin) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'Invalid or missing user_pin.'
        ),
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

  public async handleCredentialRequest(
    args: HandleCredentialRequestArgs,
    context: OIDCAgentContext
  ): Promise<Result<CredentialResponse>> {
    const { body, issuerDid, subjectDid, credentialSubjectClaims } = args;

    if (!body.format) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'Missing format.'),
      };
    }

    const supportedCredential = this.pluginConfig.supported_credentials.find(
      (cred) => {
        if (body.format === 'mso_mdoc') {
          return cred.format === body.format && cred.doctype === body.doctype;
        }

        return (
          body.format === cred.format &&
          Array.isArray(body.types) &&
          compareTypes(cred.types, body.types)
        );
      }
    );

    // Check if credential is supported
    if (!supportedCredential) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'Unsupported credential.'),
      };
    }

    if (!issuerDid) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'Missing issuer did.'),
      };
    }

    if (!subjectDid) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'Missing subject did.'),
      };
    }

    if (supportedCredential.format === 'mso_mdoc') {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'Currently the mso_mdoc format is not supported.'
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
        type: supportedCredential.types,
        // Add context if ld proof
        ...((supportedCredential.format === 'jwt_vc_json-ld' ||
          supportedCredential.format === 'ldp_vc') && {
          '@context': supportedCredential['@context'],
        }),
        // credentialSchema: {
        //   id: schema,
        //   type: 'JsonSchemaValidator2018', // TODO: We are not actually using this at the moment
        // },
        credentialSubject: {
          id: subjectDid,
          ...(credentialSubjectClaims as object), // TODO: VALIDATE CLAIMS AGAINST SCHEMA
        },
      };
    } catch (e: any) {
      return {
        success: false,
        error: new DetailedError(
          'internal_server_error',
          'Error building credential payload',
          500
        ),
      };
    }
    let credential;

    // Create credential from payload
    try {
      credential = await context.agent.createVerifiableCredential({
        credential: credentialPayload,
        proofFormat: supportedCredential.format === 'ldp_vc' ? 'lds' : 'jwt',
      });
    } catch (e) {
      return {
        success: false,
        error: new DetailedError(
          'internal_server_error',
          'Error creating credential',
          500
        ),
      };
    }

    // TODO: Implement claim validation
    // // Fetch schema
    // const schemaFetchResult = await fetch(schema);

    // if (!schemaFetchResult.ok) {
    //   return {
    //     success: false,
    //     error: new DetailedError(`DetailedError fetching schema: ${schema}`),
    //   };
    // }

    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const schemaJson = await schemaFetchResult.json();

    // // Validate credential subject claims against schema
    // const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

    // // We need to add the formats to the ajv instance
    // addFormats(ajv);

    // // FIXME: Better way to handle any extra properties or should we throw and error ?
    // ajv.addVocabulary(['$metadata']);
    // const validate = ajv.compile(schemaJson);

    // const valid = validate(credential);
    // if (!valid) {
    //   return {
    //     success: false,
    //     error: new DetailedError(
    //       `Invalid credential subject claims. Errors: ${JSON.stringify(
    //         validate.errors
    //       )}`
    //     ),
    //   };
    // }

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
        error: new DetailedError(
          'invalid_or_missing_proof',
          'Proof is required.'
        ),
      };
    }

    // Check proof format
    if (proof.proof_type !== 'jwt') {
      return {
        success: false,
        error: new DetailedError(
          'invalid_or_missing_proof',
          'Proof format missing or not supported.'
        ),
      };
    }

    // Check if jwt is present
    if (!proof.jwt) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_or_missing_proof',
          'Missing or invalid jwt.'
        ),
      };
    }

    // Decode protected header to get algorithm and key
    let protectedHeader;
    try {
      protectedHeader = decodeProtectedHeader(proof.jwt);
    } catch (e) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'Invalid jwt header.'),
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
        error: new DetailedError(
          'invalid_request',
          'Exactly one of kid, jwk, x5c must be present.'
        ),
      };
    }

    let payload;
    let publicKey;
    let did;

    if (protectedHeader.typ !== 'openid4vci-proof+jwt') {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          `Invalid JWT typ. Expected "openid4vci-proof+jwt" but got "${
            protectedHeader.typ ?? 'undefined'
          }".`
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
          error: new DetailedError('invalid_request', 'Invalid kid.'),
        };
      }

      const resolvedDid = await context.agent.resolveDid({ didUrl: did });
      if (resolvedDid.didResolutionMetadata.error || !resolvedDid.didDocument) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            `Error resolving did. Reason: ${
              resolvedDid.didResolutionMetadata.error ?? 'Unknown error'
            }.`
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
          error: new DetailedError('invalid_request', 'Invalid kid.'),
        };
      }

      if (fragment.publicKeyJwk) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            'PublickKeyJwk not supported yet.'
          ),
        };
      }
      const publicKeyHex = extractPublicKeyHex(
        fragment as _ExtendedVerificationMethod
      );

      if (publicKeyHex === '') {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            'Invalid kid or no public key present.'
          ),
        };
      }

      const supportedTypes = ['EcdsaSecp256k1VerificationKey2019'];
      if (!supportedTypes.includes(fragment.type)) {
        return {
          success: false,
          error: new DetailedError('invalid_request', 'Unsupported key type.'),
        };
      }

      let ctx: elliptic.ec;
      let curveName: string;

      if (fragment.type === 'EcdsaSecp256k1VerificationKey2019') {
        ctx = new EC('secp256k1');
        curveName = 'secp256k1';
      } else {
        return {
          success: false,
          error: new DetailedError('invalid_request', 'Unsupported key type.'),
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
        error: new DetailedError('invalid_request', 'jwk not supported.'),
      };
    } else if (protectedHeader.x5c) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'x5c not supported.'),
      };
    } else {
      // Should never happen (here for type safety)
      return {
        success: false,
        error: new DetailedError('invalid_request', 'Invalid jwt header.'),
      };
    }

    try {
      payload = (
        await jwtVerify(proof.jwt, publicKey, {
          // TODO: Maybe check ISS here ? -> MUST BE OMITTED in pre-auth flow
          audience: this.pluginConfig.url,
        })
      ).payload;
    } catch (e: unknown) {
      // TODO: new nonce ?
      // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-8.3.2
      return {
        success: false,
        error: new DetailedError(
          'invalid_or_missing_proof',
          (e as Error).toString()
        ),
      };
    }

    // Check if jwt is valid
    const { nonce } = payload;

    // Check if session contains cNonce
    if (cNonce) {
      // Check if nonce is valid
      if (nonce !== cNonce) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_or_missing_proof',
            'Invalid or missing nonce.'
          ),
        };
      }

      // Check if cNonce is expired
      if (cNonceExpiresIn && cNonceExpiresIn < Date.now()) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_or_missing_proof',
            'nonce expired.'
          ),
        };
      }
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
