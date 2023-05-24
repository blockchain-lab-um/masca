import { DetailedError, isError } from '@blockchain-lab-um/oidc-rp-plugin';
import {
  AuthorizationResponse,
  PresentationDefinition,
} from '@blockchain-lab-um/oidc-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthorizationRequest } from './app.interface.js';
import { IConfig } from './config/configuration.js';
import { AgentService } from './modules/agent/agent.service.js';
import { DatastoreService } from './modules/datastore/datastore.service.js';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService<IConfig, true>,
    private dataStoreService: DatastoreService,
    private agentService: AgentService
  ) {}

  async createAuthorizationRequest(
    query: AuthorizationRequest
  ): Promise<string> {
    const { state, credentialType } = query;

    // State is required (UUID is recommended)
    if (!state) {
      throw new DetailedError('invalid_request', 'State is required.');
    }

    // Credential type is required
    if (!credentialType) {
      throw new DetailedError(
        'invalid_request',
        'Credential type is required.'
      );
    }

    const agent = this.agentService.getAgent();

    const url = `${this.configService.get<string>(
      'VERIFIER_URL'
    )}/authorization-response`;

    // Select correct presentation definition
    const presentationDefinition = this.configService
      .get<PresentationDefinition[]>('PRESENTATION_DEFINITIONS')
      .find((pd) => pd.id === credentialType);

    if (!presentationDefinition) {
      throw new DetailedError(
        'invalid_request',
        'Presentation definition not supported.'
      );
    }

    const res = await agent.createAuthorizationRequest({
      state,
      clientId: url,
      redirectUri: url,
      presentationDefinition,
    });

    if (isError(res)) {
      throw res.error;
    }

    const { authorizationRequest, nonce, nonceExpiresIn } = res.data;

    if (this.dataStoreService.getUserSession(state)) {
      throw new DetailedError(
        'internal_server_error',
        'Authorization request with this state already exists.',
        500
      );
    }

    this.dataStoreService.createUserSession(state, {
      credentialType,
      nonce,
      nonceExpiresIn,
    });

    return authorizationRequest;
  }

  async handleAuthorizationResponse(
    body: AuthorizationResponse
  ): Promise<boolean> {
    const agent = this.agentService.getAgent();

    if (!body.state) {
      throw new DetailedError('invalid_request', 'State is required.');
    }

    const userSession = this.dataStoreService.getUserSession(body.state);

    if (!userSession) {
      throw new DetailedError(
        'invalid_request',
        'User session does not exist.'
      );
    }

    // Select correct presentation definition
    const presentationDefinition = this.configService
      .get<PresentationDefinition[]>('PRESENTATION_DEFINITIONS')
      .find((pd) => pd.id === userSession.credentialType);

    if (!presentationDefinition) {
      throw new DetailedError(
        'internal_server_error',
        'Presentation definition not found.',
        500
      );
    }

    const res = await agent.handleAuthorizationResponse({
      body,
      nonce: userSession.nonce,
      nonceExpiresIn: userSession.nonceExpiresIn,
      presentationDefinition,
    });

    if (isError(res)) {
      console.log(res.error);
      throw res.error;
    }

    return true;
  }
}
export default AppService;
