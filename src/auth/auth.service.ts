import { RegisterDto } from './dto/registerDto';
import { UserService } from './../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

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

  async login() {
    return 'login';
  }

  async logout() {
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
