import {
  isError,
  isValidAuthorizationHeader,
} from '@blockchain-lab-um/oidc-rp-plugin';
import {
  CredentialOfferRequest,
  CredentialRequest,
  CredentialResponse,
  IssuerServerMetadata,
  TokenRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IConfig } from './config/configuration';
import { AgentService } from './modules/agent/agent.service';
import { DatastoreService } from './modules/datastore/datastore.service';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService<IConfig, true>,
    private dataStoreService: DatastoreService,
    private agentService: AgentService
  ) {}

  async handleIssuerServerMetadataRequest(): Promise<IssuerServerMetadata> {
    const agent = this.agentService.getAgent();
    const issuerServerMetadata =
      await agent.handleIssuerServerMetadataRequest();

    if (isError(issuerServerMetadata)) {
      throw Error(issuerServerMetadata.error.message);
    }

    return issuerServerMetadata.data;
  }

  async createCredentialOfferRequest(
    query: CredentialOfferRequest
  ): Promise<string> {
    const { schema, grants, userPinRequired } = query;

    // Currently only pre-authorized_code is supported
    const res = await this.agentService
      .getAgent()
      .createCredentialOfferRequest({
        schema,
        grants: typeof grants === 'string' ? [grants] : grants,
        userPinRequired,
      });

    if (isError(res)) {
      throw Error(res.error.message); // FIXME - Error handling
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
          userPin: userSession.user_pin,
        });

      if (isError(tokenRequestResult)) {
        throw Error(tokenRequestResult.error.message); // FIXME
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

    throw Error(`Not implemented: ${grantType}`);
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
    if (userSession.expires_in && userSession.expires_in < Date.now()) {
      throw Error('Access token expired');
    }

    const identifier = await agent.didManagerGetByAlias({ alias: 'main-did' });

    // TODO: Add support for jwk and x5c
    const proofOfPossesionResult = await agent.proofOfPossession({
      proof: body.proof,
      cNonce: userSession.c_nonce,
      cNonceExpiresIn: userSession.c_nonce_expires_in,
    });

    if (isError(proofOfPossesionResult)) {
      throw Error(proofOfPossesionResult.error.message); // FIXME
    }

    const { did } = proofOfPossesionResult.data;

    // TODO: Then query for claims
    // TODO: Throw error if no claims found
    const claims = {
      accomplishmentType: 'Course Certificate',
      learnerName: 'John Doe',
      achievement: "Bachelor's Degree in Computer Science",
      courseProvider: this.configService.get<string>('ISSUER_URL'),
    };

    const credentialResponse = await agent.handleCredentialRequest({
      body,
      issuerDid: identifier.did,
      subjectDid: did,
      credentialSubjectClaims: claims,
    });

    if (isError(credentialResponse)) {
      throw Error(credentialResponse.error.message); // FIXME
    }

    return credentialResponse.data;
  }
}

export default AppService;
