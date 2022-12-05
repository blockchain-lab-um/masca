import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as qs from 'qs';

import {
  CredentialRequest,
  CredentialResponse,
  Credentials,
  IssuanceRequestParams,
  TokenRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { decodeJWT } from 'did-jwt';
import { IConfig } from './config/configuration';
import { DatastoreService } from './modules/datastore/datastore.service';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService<IConfig, true>,
    private dataStoreService: DatastoreService
  ) {}

  // FIXME: Query instead of hardcoding
  createIssuanceInitiationRequest(): string {
    const preAuthorizedCode = randomUUID();
    const credentials: Credentials = [
      {
        format: 'jwt_vc_json',
        types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
      },
    ];

    const params: IssuanceRequestParams = {
      issuer: this.configService.get<string>('ISSUER_URL'),
      credentials,
      'pre-authorized_code': preAuthorizedCode,
    };

    this.dataStoreService.createUserSession(preAuthorizedCode, {
      credentials,
    });

    return `openid_initiate_issuance://credential_offer?${qs.stringify(
      params
    )}`;
  }

  handleTokenRequest(body: TokenRequest): TokenResponse {
    if (body.grant_type === 'authorization_code') {
      // TODO: Implement
      // THROW ERROR
      throw new Error('Not implemented');
    }

    if (!body['pre-authorized_code']) {
      // TODO: Implement
      // THROW ERROR
      throw new Error('Invalid pre-authorized_code');
    }

    const userSession = this.dataStoreService.getUserSession(
      body['pre-authorized_code'] as string // FIXME
    );

    if (!userSession) {
      // TODO: Implement
      // THROW ERROR - invalid pre-authorized_code
      throw new Error('Invalid pre-authorized_code');
    }

    const accessToken = randomUUID();
    const cNonce = randomUUID();
    const expCNonce = Date.now() + 1000 * 60 * 60; // 1 hour
    const exp = Date.now() + 1000 * 60 * 60; // 1 hour

    this.dataStoreService.createUserSession(accessToken, {
      c_nonce: cNonce,
      c_nonce_expires_in: expCNonce,
      expires_in: exp,
      credentials: userSession.credentials,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: exp,
      c_nonce: cNonce,
      c_nonce_expires_in: expCNonce,
    };
  }

  async handleCredentialRequest(
    body: CredentialRequest,
    authorizationHeader: string
  ): Promise<CredentialResponse> {
    // Check header format (Bearer <token>)
    const [bearer, accessToken] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer') {
      // Invalid header format
      throw Error('Invalid header format');
    }

    // Check if access token is present
    if (!accessToken) {
      // Invalid access token
      throw Error('Missing or invalid access token');
    }

    // Check if access token is valid
    const userSession = this.dataStoreService.getUserSession(accessToken);

    // Session does not exist
    if (!userSession) {
      throw Error('Missing or invalid access token');
    }

    // Check if expiration is set and access token is not expired
    if (userSession.expires_in && userSession.expires_in > Date.now()) {
      throw Error('Access token expired');
    }

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

    // Decode jwt with did-jwt
    let decodedJwt;
    try {
      decodedJwt = decodeJWT(proof.jwt);
    } catch (e) {
      throw Error('Invalid jwt');
    }

    // Check if jwt is valid
    const { header, payload, signature } = decodedJwt;

    // Check if session contains c_nonce
    if (userSession.c_nonce) {
      // Check if c_nonce is valid
      if (payload.nonce !== userSession.c_nonce) {
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
    if (payload.aud !== this.configService.get<string>('ISSUER_URL')) {
      throw Error(
        `Invalid audience. Expected: ${this.configService.get<string>(
          'ISSUER_URL'
        )}`
      );
    }

    // TODO: ISS -> Must be client_id

    // Check if more than 1 is present (kid, jwk, x5c)
    if (
      [header.kid, header.jwk, header.x5c].filter((value) => value != null)
        .length !== 1
    ) {
      throw Error('Only one of kid, jwk, x5c must be present');
    }

    // Check kid
    if (header.kid) {
      // TODO
    }

    // Check jwk
    if (header.jwk) {
      throw Error('jwk not supported');
    }

    // Check x5c
    // TODO
    if (header.x5c) {
      throw Error('x5c not supported');
    }

    // TODO: User PIN
  }
}

const validateJ;

export default AppService;
