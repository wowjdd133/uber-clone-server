/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Session,
  Get,
  Body,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/registerDto';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  // session id
  // @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Session() session: Record<string, any>) {
    console.log(session.id);
    return { sessionId: session.id };
  }

  @Post('logout')
  async logout(@Session() session: Record<string, any>) {
    session.destroy();
    //db session id 제거
  }

  @ApiOperation({ summary: '회원가입', description: '회원가입임' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    console.log(registerDto);
    return true;
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('hi')
  async hi() {
    return 'hi';
  }
}
