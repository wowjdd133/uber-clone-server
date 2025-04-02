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
  Req,
} from '@nestjs/common';
// import { AuthGuard } from './auth.guard';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/registerDto';
import { AuthService } from './auth.service';
import { AuthenticatedGuard, LocalAuthGuard } from './auth.guard';
import { LoginDto } from './dto/loginDto';
import { User } from 'src/user/user.entity';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // session id
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginDto,
  })
  @Post('login')
  async login(
    @Req()
    req: {
      user: User;
    },
    @Session() session: Record<string, any>,
  ) {
    await this.authService.login(req.user.id, session.id);
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
    await this.authService.register({
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
    });

    return {
      message: '회원가입 성공',
    };
  }

  // @ApiCookieAuth()
  @UseGuards(AuthenticatedGuard)
  @Get('hi')
  async hi() {
    return 'hi';
  }
}
