import { RegisterDto } from './dto/registerDto';
import { UserService } from './../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { timestamp } from 'rxjs';
import { timeStamp } from 'console';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectRedis() private readonly client: Redis,
  ) {}

  private comparePasswordWithHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email, true);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!this.comparePasswordWithHash(password, user.password)) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async authenticate(sessionId: string) {
    try {
      const sessionData = await this.client.exists(sessionId);
      if (sessionData === 0)
        throw new HttpException(
          'user is not logged in',
          HttpStatus.UNAUTHORIZED,
        );
    } catch (err) {
      console.error(err);
      throw new HttpException('user is not logged in', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }

  async login(userId: string, sessionId: string) {
    try {
      await this.client.set(
        sessionId,
        `${userId}:${new Date().getTime()}`,
        'EX',
        1, // 60 * 60 * 24,
      ); // 1 day expiration
    } catch (err) {
      console.error(err);
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
    return 'login';
  }

  async logout(userId: string) {
    try {
      await this.client.del(userId);
    } catch (err) {
      console.error(err);
    }
    return 'logout';
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    const existingUser = await this.userService.findOneByEmail(email);

    if (existingUser) {
      throw new HttpException(
        'User already exists with this email',
        HttpStatus.CONFLICT,
      );
    }

    const newUser = this.userService.create({
      email,
      password,
      name,
    });

    return newUser;
  }

  hi() {
    return 'hi';
  }
}
