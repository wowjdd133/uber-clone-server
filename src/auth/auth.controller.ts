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
// import { AuthGuard } from './auth.guard';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/registerDto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './auth.guard';
import { LoginDto } from './dto/loginDto';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // session id
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginDto, @Session() session: Record<string, any>) {
    // console.log(body);
    console.log('session', session.id);
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
    await this.authService.register(registerDto);

    return {
      message: '회원가입 성공',
    };
  }

  // @ApiCookieAuth()
  @UseGuards(LocalAuthGuard)
  @Get('hi')
  async hi() {
    return 'hi';
  }
}
