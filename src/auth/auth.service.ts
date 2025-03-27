import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login() {
    return 'login';
  }

  async logout() {
    return 'logout';
  }

  async register() {
    return 'register';
  }

  hi() {
    return 'hi';
  }
}
