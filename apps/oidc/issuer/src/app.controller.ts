import type {
  CredentialOfferRequest,
  CredentialRequest,
  CredentialResponse,
  IssuerServerMetadata,
  TokenRequest,
  TokenResponse,
} from '@blockchain-lab-um/oidc-types';
import {
  BadRequestException,
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
import type { FastifyReply } from 'fastify';
import qs from 'qs';

import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/.well-known/openid-credential-issuer')
  @HttpCode(200)
  metadata(): Promise<IssuerServerMetadata> {
    return this.appService.handleIssuerServerMetadataRequest();
  }

  // TODO Question: Implement later
  @Get('/authorize')
  @HttpCode(302)
  async authorize(
    @Response({ passthrough: true }) res: FastifyReply
  ): Promise<void> {
    // Redirect
    return res.redirect(302, 'https://example.com/redirect');
  }

  @Get('/credential-offer')
  @HttpCode(200)
  async initiate(@Query() query: unknown): Promise<string> {
    return this.appService.createCredentialOfferRequest(
      qs.parse(query as string, {
        depth: 50,
        parameterLimit: 1000,
      }) as unknown as CredentialOfferRequest
    );
  }

  // TODO: Later -> access_token
  // TODO: https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.3
  @Post('/token')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  async token(
    @Headers('content-type') contentType: string,
    @Body() body: TokenRequest
  ): Promise<TokenResponse> {
    // Validate request header content-type
    if (
      !contentType.toLowerCase().includes('application/x-www-form-urlencoded')
    ) {
      throw new BadRequestException(`Invalid content-type: ${contentType}`);
    }

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
