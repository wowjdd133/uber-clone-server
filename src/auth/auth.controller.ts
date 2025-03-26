/* eslint-disable @typescript-eslint/require-await */
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Session,
  Get,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ApiCookieAuth } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Session() session: Record<string, any>) {
    console.log(session.id);
    return { sessionId: session.id };
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('hi')
  async hi() {
    return 'hi';
  }
}
