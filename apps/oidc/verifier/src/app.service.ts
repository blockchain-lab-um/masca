import { isError } from '@blockchain-lab-um/oidc-rp-plugin';
import {
  AuthorizationResponse,
  PresentationDefinition,
} from '@blockchain-lab-um/oidc-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthorizationRequest } from './app.interface';
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

  async createAuthorizationRequest(
    query: AuthorizationRequest
  ): Promise<string> {
    const { state, credentialType } = query;

    // State is required (UUID is recommended)
    if (!state) {
      throw Error('State is required');
    }

    // Credential type is required
    if (!credentialType) {
      throw Error('Credential type is required');
    }

    const agent = this.agentService.getAgent();

    const url = `${this.configService.get<string>(
      'VERIFIER_URL'
    )}/authorization-response
    `;

    // Select correct presentation definition

    const res = await agent.createAuthorizationRequest({
      state,
      clientId: url,
      redirectUri: url,
      presentationDefinition: {} as unknown as PresentationDefinition,
    });

    if (isError(res)) {
      throw Error(res.error.message); // FIXME
    }

    const { authorizationRequest, nonce, nonceExpiresIn } = res.data;

    if (this.dataStoreService.getUserSession(state)) {
      throw Error('State already exists');
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
      throw Error('State is required');
    }

    const userSession = this.dataStoreService.getUserSession(body.state);

    if (!userSession) {
      throw Error('State does not exist');
    }

    // FIXME: id_token must be included -> proofOfPossession -> replay attack

    const res = await agent.handleAuthorizationResponse({
      body,
    });

    if (isError(res)) {
      throw Error(res.error.message); // FIXME
    }

    return true;
  }

  // selectPresentationDefinition(
  //   credentialType: string
  // ): PresentationDefinition {}
}
export default AppService;
