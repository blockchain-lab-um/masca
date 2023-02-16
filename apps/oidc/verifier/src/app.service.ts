import { isError } from '@blockchain-lab-um/oidc-rp-plugin';
import { AuthorizationResponse } from '@blockchain-lab-um/oidc-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfig } from './config/configuration';
import { AgentService } from './modules/agent/agent.service';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService<IConfig, true>,
    private agentService: AgentService
  ) {}

  async createAuthorizationRequest(): Promise<string> {
    const agent = this.agentService.getAgent();

    const res = await agent.createAuthorizationRequest();

    if (isError(res)) {
      throw Error(res.error.message); // FIXME
    }

    return res.data;
  }

  async handleAuthorizationResponse(
    contentType: string,
    body: AuthorizationResponse
  ): Promise<boolean> {
    const agent = this.agentService.getAgent();

    /*
      contentTypeHeader: string;
      c_nonce?: string;
      c_nonce_expires_in?: number;
      body: AuthorizationResponse;
    */
    const res = await agent.handleAuthorizationResponse({
      body,
      contentTypeHeader: contentType,
    });

    if (isError(res)) {
      throw Error(res.error.message); // FIXME
    }

    return true;
  }
}
export default AppService;
