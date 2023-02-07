import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import {
  CredentialOfferRequest,
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

  @Get('/.well-known/openid-credential-issuer')
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
  @Get('/credential-offer')
  @HttpCode(200)
  async initiate(@Query() query: CredentialOfferRequest): Promise<string> {
    return this.appService.createCredentialOfferRequest(query);
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
