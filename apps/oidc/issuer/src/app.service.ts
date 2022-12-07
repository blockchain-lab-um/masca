import * as qs from 'qs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import {
  CredentialRequest,
  CredentialResponse,
  TokenRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { jwtVerify, decodeProtectedHeader } from 'jose';
import { isError } from '@blockchain-lab-um/oidc-rp-plugin/dist/src/utils';
import { IConfig } from './config/configuration';
import { DatastoreService } from './modules/datastore/datastore.service';
import { AgentService } from './modules/agent/agent.service';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService<IConfig, true>,
    private dataStoreService: DatastoreService,
    private agentService: AgentService
  ) {}

  // FIXME: Query instead of hardcoding
  async createIssuanceInitiationRequest(): Promise<string> {
    const res = await this.agentService
      .getAgent()
      .createIssuanceInitiationRequest();

    if (isError(res)) {
      throw Error(res.error.message); // FIXME
    }

    const { issuanceInitiationRequest, preAuthorizedCode, credentials } =
      res.data;

    this.dataStoreService.createUserSession(preAuthorizedCode, {
      credentials,
    });

    return issuanceInitiationRequest;
  }

  async handleTokenRequest(body: TokenRequest): Promise<TokenResponse> {
    const agent = this.agentService.getAgent();
    const validationResult = await agent.isValidTokenRequest({ body });

    if (isError(validationResult)) {
      throw Error(validationResult.error.message); // FIXME
    }

    const { grantType } = validationResult.data;

    if (grantType === 'urn:ietf:params:oauth:grant-type:pre-authorized_code') {
      const { preAuthorizedCode } = validationResult.data;

      const userSession =
        this.dataStoreService.getUserSession(preAuthorizedCode);

      if (!userSession) {
        throw Error('Invalid or missing pre-authorized_code');
      }

      const tokenRequestResult =
        await agent.handlePreAuthorizedCodeTokenRequest({
          body,
          preAuthorizedCode,
        });

      if (isError(tokenRequestResult)) {
        throw Error(tokenRequestResult.error.message); // FIXME
      }

      const {
        access_token: accessToken,
        c_nonce: cNonce,
        c_nonce_expires_in: expCNonce,
        expires_in: exp,
      } = tokenRequestResult.data; // FIXME: Some fields are optional and we not checking some yet

      this.dataStoreService.createUserSession(accessToken, {
        c_nonce: cNonce,
        c_nonce_expires_in: expCNonce,
        expires_in: exp,
        credentials: userSession.credentials,
      });

      return tokenRequestResult.data;
    }

    throw Error('Not implemented');
  }

  async handleCredentialRequest(
    body: CredentialRequest,
    authorizationHeader: string
  ): Promise<CredentialResponse> {
    const agent = this.agentService.getAgent();
    const authHeaderValidationResult = await agent.isValidAuthorizationHeader({
      authorizationHeader,
    });

    if (isError(authHeaderValidationResult)) {
      throw Error(authHeaderValidationResult.error.message); // FIXME
    }

    // Check if access token is valid
    const userSession = this.dataStoreService.getUserSession(
      authHeaderValidationResult.data.accessToken
    );

    // Session does not exist
    if (!userSession) {
      throw Error('Missing or invalid access token');
    }

    // Check if expiration is set and access token is not expired
    if (userSession.expires_in && userSession.expires_in > Date.now()) {
      throw Error('Access token expired');
    }
  }
}

export default AppService;
