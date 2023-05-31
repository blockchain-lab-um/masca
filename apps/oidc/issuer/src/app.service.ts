import {
  DetailedError,
  isError,
  isValidAuthorizationHeader,
} from '@blockchain-lab-um/oidc-rp-plugin';
import {
  TOKEN_ERRORS,
  type CredentialOfferRequest,
  type CredentialRequest,
  type CredentialResponse,
  type IssuerServerMetadata,
  type TokenRequest,
  type TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { IConfig } from './config/configuration.js';
import { AgentService } from './modules/agent/agent.service.js';
import { DatastoreService } from './modules/datastore/datastore.service.js';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService<IConfig, true>,
    private dataStoreService: DatastoreService,
    private agentService: AgentService
  ) {}

  async handleIssuerServerMetadataRequest(): Promise<IssuerServerMetadata> {
    const agent = this.agentService.getAgent();
    const res = await agent.handleIssuerServerMetadataRequest();

    if (isError(res)) {
      throw res.error;
    }

    return res.data;
  }

  async createCredentialOfferRequest(
    query: CredentialOfferRequest
  ): Promise<string> {
    let { credentials, grants } = query;
    const { userPinRequired } = query;

    if (!Array.isArray(credentials)) {
      credentials = [credentials];
    }

    if (grants && !Array.isArray(grants)) {
      grants = [grants];
    }

    // Currently only pre-authorized_code is supported
    const res = await this.agentService
      .getAgent()
      .createCredentialOfferRequest({
        credentials,
        grants,
        userPinRequired,
      });

    if (isError(res)) {
      throw res.error;
    }

    const {
      credentialOfferRequest,
      credentials: requestedCredentials,
      preAuthorizedCode,
      userPin,
    } = res.data;

    if (preAuthorizedCode) {
      this.dataStoreService.createUserSession(preAuthorizedCode, {
        credentials: requestedCredentials,
        ...(userPin && { user_pin: userPin }),
      });
    }

    return credentialOfferRequest;
  }

  async handleTokenRequest(body: TokenRequest): Promise<TokenResponse> {
    const agent = this.agentService.getAgent();
    const validationResult = await agent.isValidTokenRequest({ body });

    if (isError(validationResult)) {
      throw validationResult.error;
    }

    const { grantType } = validationResult.data;

    if (grantType === 'urn:ietf:params:oauth:grant-type:pre-authorized_code') {
      const { preAuthorizedCode } = validationResult.data;

      const userSession =
        this.dataStoreService.getUserSession(preAuthorizedCode);

      if (!userSession) {
        throw new DetailedError(
          'invalid_request',
          'Invalid or missing pre-authorized_code.'
        );
      }

      const tokenRequestResult =
        await agent.handlePreAuthorizedCodeTokenRequest({
          body,
          preAuthorizedCode,
          userPin: userSession.user_pin,
        });

      if (isError(tokenRequestResult)) {
        throw tokenRequestResult.error;
      }

      const {
        access_token: accessToken,
        c_nonce: cNonce,
        c_nonce_expires_in: expCNonce,
        expires_in: exp,
      } = tokenRequestResult.data;

      this.dataStoreService.createUserSession(accessToken, {
        c_nonce: cNonce,
        c_nonce_expires_in: expCNonce,
        expires_in: exp,
        credentials: userSession.credentials,
      });

      return tokenRequestResult.data;
    }

    throw new DetailedError(
      'unsupported_grant_type',
      TOKEN_ERRORS.unsupported_grant_type
    );
  }

  async handleCredentialRequest(
    body: CredentialRequest,
    authorizationHeader: string
  ): Promise<CredentialResponse> {
    const agent = this.agentService.getAgent();
    const authHeaderValidationResult = isValidAuthorizationHeader({
      authorizationHeader,
    });

    if (isError(authHeaderValidationResult)) {
      throw authHeaderValidationResult.error;
    }

    // Check if access token is valid
    const userSession = this.dataStoreService.getUserSession(
      authHeaderValidationResult.data.accessToken
    );

    // Session does not exist
    if (!userSession) {
      throw new DetailedError(
        'invalid_token',
        'Missing or invalid access token.'
      );
    }

    // Check if expiration is set and access token is not expired
    if (userSession.expires_in && userSession.expires_in < Date.now()) {
      throw new DetailedError('invalid_token', 'Access token expired.');
    }

    const identifier = await agent.didManagerGetByAlias({ alias: 'main-did' });

    // TODO: Add support for jwk and x5c
    const proofOfPossesionResult = await agent.proofOfPossession({
      proof: body.proof,
      cNonce: userSession.c_nonce,
      cNonceExpiresIn: userSession.c_nonce_expires_in,
    });

    if (isError(proofOfPossesionResult)) {
      throw proofOfPossesionResult.error;
    }

    const { did } = proofOfPossesionResult.data;

    // TODO: Check if the requested credentials are the same as the ones in the session

    // TODO: Then query for claims
    // TODO: Throw error if no claims found
    const claims = {};

    const credentialResponse = await agent.handleCredentialRequest({
      body,
      issuerDid: identifier.did,
      subjectDid: did,
      credentialSubjectClaims: claims,
    });

    if (isError(credentialResponse)) {
      throw credentialResponse.error;
    }

    return credentialResponse.data;
  }
}

export default AppService;
