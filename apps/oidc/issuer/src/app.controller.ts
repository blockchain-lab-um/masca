import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Response,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import {
  CredentialRequest,
  CredentialResponse,
  ServerMetadata,
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
  metadata(): ServerMetadata {
    const exampleMetadata: ServerMetadata = {
      issuer: 'https://issuer.example.com',
      authorization_endpoint: 'https://issuer.example.com/auth',
      token_endpoint: 'https://issuer.example.com/token',
      credential_endpoint: 'https://issuer.example.com/credentials',
      response_types_supported: [
        'code',
        'id_token',
        'id_token token',
        'code id_token',
        'code token',
        'code id_token token',
      ],
      credentials_supported: [
        {
          format: 'jwt_vc_json',
          id: 'https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json',
          types: ['VerifiableCredential', 'ProgramCompletionCertificate'],
          cryptographic_binding_methods_supported: ['did'],
          cryptographic_suites_supported: ['ES256K'],
        },
      ],
    };

    return exampleMetadata;
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
  initiate(): string {
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

  // TODO: Add Proof of Possession - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-binding-the-issued-credenti
  @Post('/credential')
  @HttpCode(200)
  async credential(
    @Body() body: CredentialRequest
  ): Promise<CredentialResponse> {
    return this.appService.handleCredentialRequest(body);
  }
}

export default AppController;
