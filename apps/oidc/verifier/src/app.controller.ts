import { AuthorizationResponse } from '@blockchain-lab-um/oidc-types';
import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common';

import { AuthorizationRequest } from './app.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/authorization-request')
  @HttpCode(200)
  @Header('Content-Type', 'text/plain; charset=utf-8')
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
      throw new Error(`Invalid content-type: ${contentType}`);
    }

    return this.appService.handleAuthorizationResponse(body);
  }
}

export default AppController;
