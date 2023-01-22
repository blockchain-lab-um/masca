import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  Post,
  Response,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import {
  CredentialRequest,
  CredentialResponse,
  IssuerServerMetadata,
  TokenRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // TODO: Implement later
  @Get('/metadata')
  @HttpCode(200)
  metadata(): Promise<IssuerServerMetadata> {
    return this.appService.handleIssuerServerMetadataRequest();
  }

  // TODO: Implement later
  @Get('/authorize')
  @HttpCode(302)
  async authorize(
    @Response({ passthrough: true }) res: FastifyReply
  ): Promise<void> {
    // Redirect
    return res.redirect(302, 'https://example.com/redirect');
  }

  // TODO: ??
  @Get('/initiation-request')
  async initiate(): Promise<string> {
    // TODO: Define query parameters
    // TODO: Redirect ?
    return this.appService.createIssuanceInitiationRequest();
  }

  // TODO: Later -> access_token
  // TODO: Add header `content-type: application/x-www-form-urlencoded` validation dto
  // TODO: https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.3
  @Post('/token')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  async token(@Body() body: TokenRequest): Promise<TokenResponse> {
    return this.appService.handleTokenRequest(body);
  }

  @Post('/credential')
  @HttpCode(200)
  async credential(
    @Headers('Authorization') authorization: string,
    @Body() body: CredentialRequest
  ): Promise<CredentialResponse> {
    return this.appService.handleCredentialRequest(body, authorization);
  }
}

export default AppController;
