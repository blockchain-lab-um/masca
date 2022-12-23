import { AuthorizationResponse } from '@blockchain-lab-um/oidc-types';
import { Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/authorization-request')
  @HttpCode(200)
  async authorize(): Promise<string> {
    return this.appService.createAuthorizationRequest();
  }

  @Post('/authorization-response')
  @HttpCode(200)
  async authResponse(
    @Headers('Content-Type') contentType: string,
    @Body() body: AuthorizationResponse
  ): Promise<boolean> {
    return this.appService.handleAuthorizationResponse(contentType, body);
  }
}

export default AppController;
