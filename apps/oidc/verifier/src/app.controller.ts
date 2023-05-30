import { AuthorizationResponse } from '@blockchain-lab-um/oidc-types';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common';

import { AuthorizationRequest } from './app.interface.js';
import { AppService } from './app.service.js';
import { VerificationResults } from './modules/datastore/datastore.interface.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/authorization-request')
  @HttpCode(200)
  async authorize(@Query() query: AuthorizationRequest): Promise<string> {
    return this.appService.createAuthorizationRequest(query);
  }

  @Post('/authorization-response')
  @HttpCode(200)
  async authResponse(
    @Headers('Content-Type') contentType: string,
    @Body() body: AuthorizationResponse
  ): Promise<boolean> {
    // Validate request header content-type
    if (
      !contentType.toLowerCase().includes('application/x-www-form-urlencoded')
    ) {
      throw new BadRequestException(`Invalid content-type: ${contentType}`);
    }

    return this.appService.handleAuthorizationResponse(body);
  }

  @Get('/verification-results')
  @HttpCode(200)
  async verificationResults(
    @Query('id') id: string
  ): Promise<VerificationResults> {
    return this.appService.getVerificationResults(id);
  }
}

export default AppController;
