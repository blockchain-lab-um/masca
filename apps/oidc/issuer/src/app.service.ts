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
    body: CredentialRequest
  ): Promise<CredentialResponse> {
    console.log(body);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          format: 'jwt_vc_json',
          credential: 'test_credential',
        });
      }, 1000);
    });
  }
}

export default AppService;
