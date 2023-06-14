import { randomUUID } from 'crypto';
import {
  TOKEN_ERRORS,
  type AuthorizationRequest,
  type CredentialResponse,
  type Credentials,
  type IssuerServerMetadata,
  type TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { PEX, Status, type EvaluationResults } from '@sphereon/pex';
import type {
  IVerifiableCredential,
  OriginalVerifiablePresentation,
} from '@sphereon/ssi-types';
import { CredentialPayload, IAgentPlugin } from '@veramo/core';
import {
  bytesToBase64url,
  extractPublicKeyHex,
  type _ExtendedVerificationMethod,
} from '@veramo/utils';
import _Ajv from 'ajv';
import _addFormats from 'ajv-formats';
import type { JsonWebKey, VerificationMethod } from 'did-resolver';
import elliptic from 'elliptic';
import {
  calculateJwkThumbprint,
  decodeJwt,
  decodeProtectedHeader,
  importJWK,
  jwtVerify,
  type JWK,
} from 'jose';
import qs from 'qs';

import type {
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
import type {
  IOIDCRPPlugin,
  OIDCRPAgentContext,
} from '../types/IOIDCRPPlugin.js';
import DetailedError from '../utils/detailedError.js';
import type { Result } from '../utils/index.js';

const pex: PEX = new PEX();
const { ec: EC } = elliptic;
const Ajv = _Ajv as unknown as typeof _Ajv.default;
const addFormats = _addFormats as unknown as typeof _addFormats.default;

const compareTypes = (first: string[], second: string[]) =>
  first.length === second.length && first.every((ele, i) => ele === second[i]);

/**
 * {@inheritDoc IMyAgentPlugin}
 * @beta
 */
export class OIDCRPPlugin implements IAgentPlugin {
  // readonly schema = schema.OIDCPlugin;
  private pluginConfig: IPluginConfig = {} as IPluginConfig;

  constructor(config: IPluginConfig) {
    this.pluginConfig = config;
  }

  readonly methods: IOIDCRPPlugin = {
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
    // TODO: Add support for presentation_definition_uri
    const { presentationDefinition, clientId, redirectUri, state, overrides } =
      args;

    const nonce = overrides?.nonce ?? randomUUID();
    const nonceExpiresIn =
      Date.now() + (overrides?.nonceExpiresIn ?? 1000 * 60 * 60); // 1 hour default

    // TODO: Support signed version of request -> client_id needs to be a DID
    // https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-verifier-metadata-managemen

    // TODO: => ???
    // https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#name-self-issued-openid-provider-a

    const authorizationRequest: AuthorizationRequest = {
      scope: 'openid',
      response_type: 'vp_token id_token',
      id_token_type: 'subject_signed',
      client_id: clientId,
      redirect_uri: redirectUri,
      nonce,
      presentation_definition: presentationDefinition,
      state,
    };

    const params = {
      ...authorizationRequest,
      presentation_definition: authorizationRequest.presentation_definition,
    };

    return {
      success: true,
      data: {
        authorizationRequest: `openid://?${qs.stringify(params, {
          encode: true,
        })}`,
        nonce,
        nonceExpiresIn,
      },
    };
  }

  public async handleAuthorizationResponse(
    args: HandleAuthorizationResponseArgs,
    context: OIDCRPAgentContext
  ): Promise<Result<boolean>> {
    const {
      body,
      nonce: cNonce,
      nonceExpiresIn: cNonceExpiresIn,
      presentationDefinition,
    } = args;

    const {
      id_token: idToken,
      vp_token: vpToken, // TODO: For now its always a string (jwt) ? qs.parse for object ?
      presentation_submission: presentationSubmission,
    } = body;

    // https://openid.bitbucket.io/connect/openid-connect-self-issued-v2-1_0.html#name-self-issued-id-token
    // TODO: Support JWT Thumbprint and sub_jwk
    if (!idToken) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'id_token must be present'),
      };
    }

    if (!vpToken) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'vp_token must be present'),
      };
    }

    if (!presentationSubmission) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'presentation_submission must be present'
        ),
      };
    }

    if (!presentationDefinition) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'presentationDefinition must be present'
        ),
      };
    }

    let protectedHeader;

    // Self-Issued ID Token Validation:
    // https://openid.bitbucket.io/connect/openid-connect-self-issued-v2-1_0.html#name-self-issued-id-token-valida
    try {
      protectedHeader = decodeProtectedHeader(idToken);
    } catch (e) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'Invalid id_token jwt header'
        ),
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
    // ID_TOKEN: Decode payload
    try {
      payload = decodeJwt(idToken);
    } catch (e) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'Invalid id_token jwt payload'
        ),
      };
    }

    // ID_TOKEN: Check iss and sub are equal
    if (!payload.iss || !payload.sub || payload.iss !== payload.sub) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'id_token iss and sub must be equal'
        ),
      };
    }

    // ID_TOKEN: Check exp
    if (payload.exp && 1000 * payload.exp < Date.now()) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'id_token expired'),
      };
    }

    // ID_TOKEN: Check nbf
    if (payload.nbf && 1000 * payload.nbf > Date.now()) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'id_token not valid yet'),
      };
    }

    // TODO: Sign auth requests
    // ID_TOKEN: Check audience:
    // Needs to be the Client ID sent in the Authorization Request or
    // if the request was signed, it can also be a DID or HTTPS URL
    if (
      !payload.aud ||
      payload.aud !== `${this.pluginConfig.url}/authorization-response`
    ) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          `id_token audience is invalid. Must be ${this.pluginConfig.url}/authorization-response`
        ),
      };
    }

    // Check if session contains nonce
    if (cNonce) {
      // ID_TOKEN: Check if nonce is valid
      if (payload.nonce !== cNonce) {
        return {
          success: false,
          error: new DetailedError('invalid_request', 'Invalid nonce'),
        };
      }

      // ID_TOKEN: Check if nonce is expired
      if (cNonceExpiresIn && cNonceExpiresIn < Date.now()) {
        return {
          success: false,
          error: new DetailedError('invalid_request', 'Nonce expired'),
        };
      }
    }

    // ID_TOKEN was signed with a DID
    if (payload.iss.startsWith('did')) {
      if (payload.sub_jwk) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            'id_token must not contain sub_jwk when signed with DID'
          ),
        };
      }

      if (!protectedHeader.kid) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            'id_token must contain kid in header when signed with DID'
          ),
        };
      }

      resolvedDid = await context.agent.resolveDid({ didUrl: payload.iss });
      if (resolvedDid.didResolutionMetadata.error || !resolvedDid.didDocument) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            `Error resolving did. Reason: ${
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
          error: new DetailedError('invalid_request', 'Invalid kid'),
        };
      }

      publicKeyHex = extractPublicKeyHex(
        fragment as _ExtendedVerificationMethod
      );

      if (publicKeyHex === '') {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            'Invalid kid or no public key present'
          ),
        };
      }

      const supportedTypes = ['EcdsaSecp256k1VerificationKey2019'];
      if (!supportedTypes.includes(fragment.type)) {
        return {
          success: false,
          error: new DetailedError('invalid_request', 'Unsupported key type'),
        };
      }

      if (fragment.type === 'EcdsaSecp256k1VerificationKey2019') {
        ctx = new EC('secp256k1');
        curveName = 'secp256k1';
      } else {
        return {
          success: false,
          error: new DetailedError('invalid_request', 'Unsupported key type'),
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
      // ID_TOKEN was signed with a JWK
      // TODO: Check id_token_signing_alg_values_supported
      if (!payload.sub_jwk) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            'id_token must contain sub_jwk when signed with JWK'
          ),
        };
      }

      // Check jwk thumbprint
      const jwkThumbprint = await calculateJwkThumbprint(
        payload.sub_jwk as JWK
      );

      if (jwkThumbprint !== payload.sub) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            'id_token sub does not match sub_jwk thumbprint'
          ),
        };
      }

      publicKey = await importJWK(payload.sub_jwk as JWK);
    }

    // Verify signature
    try {
      await jwtVerify(idToken, publicKey, {
        audience: `${this.pluginConfig.url}/authorization-response`,
      });
    } catch (e) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'id_token signature invalid'
        ),
      };
    }

    if (
      !Array.isArray(presentationSubmission.descriptor_map) ||
      presentationSubmission.descriptor_map.length === 0
    ) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'presentation_submission descriptor_map must be an array with at least one element'
        ),
      };
    }

    if (presentationSubmission.definition_id !== presentationDefinition.id) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          'presentation_submission definition_id does not match presentation_definition id'
        ),
      };
    }

    try {
      // Array of verifiable presentation
      if (Array.isArray(vpToken)) {
        // TODO: Add support for array of verifiable presentations
        return {
          success: false,
          error: new DetailedError(
            'internal_server_error',
            'Array of verifiable presentations not supported yet',
            500
          ),
        };
      }

      // TODO: Check type/context with presentation_definition (maybe already works)
      let evalResult: EvaluationResults;

      evalResult = pex.evaluatePresentation(
        presentationDefinition,
        vpToken as OriginalVerifiablePresentation,
        {
          presentationSubmission, // TODO: This is not being used
          restrictToDIDMethods: this.pluginConfig.supported_did_methods,
          ...(presentationDefinition.format && {
            restrictToFormats: presentationDefinition.format, // FIXME: This is not working (ldp, and eio)
          }),
        }
      );

      if (evalResult.areRequiredCredentialsPresent === Status.WARN) {
        console.log('Method was called with more credentials than required.');
      } else if (evalResult.areRequiredCredentialsPresent === Status.ERROR) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            "The presentation you've sent didn't satisfy the requirement defined presentationDefinition object."
          ),
        };
      }

      if (evalResult.errors && evalResult.errors.length > 0) {
        console.log(evalResult.errors);
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            "The presentation you've sent didn't satisfy the requirement defined presentationDefinition object."
          ),
        };
      }

      if (evalResult.warnings && evalResult.warnings.length > 0) {
        console.log(evalResult.warnings);
      }

      evalResult = pex.evaluateCredentials(
        presentationDefinition,
        evalResult.verifiableCredential,
        {
          restrictToDIDMethods: this.pluginConfig.supported_did_methods, // TODO: Doesn't check subject (only issuer)
          ...(presentationDefinition.format && {
            restrictToFormats: presentationDefinition.format,
          }),
        }
      );

      if (evalResult.areRequiredCredentialsPresent === Status.WARN) {
        console.log('Method was called with more credentials than required.');
      } else if (evalResult.areRequiredCredentialsPresent === Status.ERROR) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            "The credentials you've sent didn't satisfy the requirement defined presentationDefinition object."
          ),
        };
      }

      if (evalResult.errors && evalResult.errors.length > 0) {
        console.log(evalResult.errors);
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            "The credentials you've sent didn't satisfy the requirement defined presentationDefinition object."
          ),
        };
      }

      if (evalResult.warnings && evalResult.warnings.length > 0) {
        console.log(evalResult.warnings);
      }

      // Challange is the nonce if it exists for the session
      const verified = await context.agent.verifyPresentation({
        presentation: vpToken,
        domain: `${this.pluginConfig.url}/authorization-response`,
        ...(cNonce && { challenge: cNonce }),
      });

      if (!verified.verified) {
        return {
          success: false,
          error: new DetailedError(
            'invalid_request',
            `Invalid vp. Reason: ${verified.error?.message ?? 'Unknown error'}`
          ),
        };
      }

      const credentials: IVerifiableCredential[] =
        evalResult.verifiableCredential ?? [];

      // Check if vp contains atleast one credential
      if (!credentials) {
        return {
          success: false,
          error: new DetailedError('invalid_request', 'No credentials in vp'),
        };
      }

      // Verify all credentials
      const verificationResults = await Promise.all(
        credentials.map(async (vc) =>
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
            'invalid_request',
            `Atleast one credential is invalid. Reason: ${
              invalidCredentials[0].error?.message ?? 'Unknown error'
            }`
          ),
        };
      }
    } catch (e) {
      console.log(e);
      return {
        success: false,
        error: new DetailedError(
          'internal_server_error',
          'Unexpected error occured while verifying vp_token',
          500
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
      credentials_supported: this.pluginConfig.supported_credentials ?? [],
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
        .supported_credentials ?? []) {
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
      credential_offer: {
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
                user_pin_required: userPinRequired ?? false,
              },
            }),
          },
        }),
      },
    };

    return {
      success: true,
      data: {
        credentialOfferRequest: `openid-credential-offer://?${qs.stringify(
          params,
          { encode: true }
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
    context: OIDCRPAgentContext
  ): Promise<Result<CredentialResponse>> {
    const { body, issuerDid, subjectDid, credentialSubjectClaims } = args;

    if (!body.format) {
      return {
        success: false,
        error: new DetailedError('invalid_request', 'Missing format.'),
      };
    }

    const supportedCredential = this.pluginConfig.supported_credentials?.find(
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
        credentialSchema: supportedCredential.credentialSchema,
        // SUB field is required or else Veramo deletes the credentialSubject.id field
        // -> this throws an error for empty credentialSubject
        sub: subjectDid,
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

    // Fetch schema
    // const schemaFetchResult = await fetch(
    //   supportedCredential.credentialSchema.id
    // );

    // if (!schemaFetchResult.ok) {
    //   return {
    //     success: false,
    //     error: new DetailedError(
    //       'internal_server_error',
    //       `DetailedError fetching schema: ${supportedCredential.credentialSchema.id}`
    //     ),
    //   };
    // }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const schemaJson = await schemaFetchResult.json();
    const schemaJson = {
      $id: 'https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/GMCredential/1-0-0.json',
      $schema: 'http://json-schema.org/draft-07/schema#',
      description:
        'Send a GM greeting to colleagues and friends in your network.',
      properties: {
        '@context': {
          anyOf: [
            {
              type: 'string',
            },
            {
              type: 'array',
            },
            {
              type: 'object',
            },
          ],
        },
        credentialSchema: {
          properties: {
            id: {
              format: 'uri',
              type: 'string',
            },
            type: {
              type: 'string',
            },
          },
          required: ['id', 'type'],
          type: 'object',
        },
        credentialSubject: {
          properties: {
            id: {
              format: 'uri',
              title: 'Recipient DID',
              type: 'string',
            },
          },
          required: ['id'],
          type: 'object',
        },
        expirationDate: {
          format: 'date-time',
          type: 'string',
        },
        id: {
          format: 'uri',
          type: 'string',
        },
        issuanceDate: {
          format: 'date-time',
          type: 'string',
        },
        issuer: {
          anyOf: [
            {
              format: 'uri',
              type: 'string',
            },
            {
              properties: {
                id: {
                  format: 'uri',
                  type: 'string',
                },
              },
              required: ['id'],
              type: 'object',
            },
          ],
        },
        type: {
          anyOf: [
            {
              type: 'string',
            },
            {
              items: {
                type: 'string',
              },
              type: 'array',
            },
          ],
        },
      },
      required: [
        '@context',
        'type',
        'issuer',
        'issuanceDate',
        'credentialSubject',
      ],
      title: 'GM Credential',
      type: 'object',
    };

    // Validate credential subject claims against schema
    const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

    // // We need to add the formats to the ajv instance
    addFormats(ajv);

    // FIXME: Better way to handle any extra properties or should we throw and error ?
    // ajv.addVocabulary(['$metadata']);

    const validate = ajv.compile(schemaJson);

    const valid = validate(credential);

    if (!valid) {
      return {
        success: false,
        error: new DetailedError(
          'invalid_request',
          `Invalid credential subject claims. Errors: ${JSON.stringify(
            validate.errors
          )}`
        ),
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

  public async proofOfPossession(
    args: ProofOfPossesionArgs,
    context: OIDCRPAgentContext
  ): Promise<Result<ProofOfPossesionResponseArgs>> {
    const { proof, cNonce, cNonceExpiresIn } = args;

    if (!proof) {
      // TODO: We REQUIRE proof for now
      // Later we can implement section 13.2
      // https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#section-13.2
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
        publicKey = await importJWK(fragment.publicKeyJwk, protectedHeader.alg);
      } else {

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
      }
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

export default OIDCRPPlugin;
