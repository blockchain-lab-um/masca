import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/authentication-request')
  @HttpCode(200)
  authorize(): string {
    return 'auth-req';
  }

  @Post('/authentication-resposne')
  @HttpCode(200)
  authResponse(): string {
    return 'auth-res';
  }
}

export default AppController;
