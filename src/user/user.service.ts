import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/registerDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private hashPasswordWithSalt(password: string): {
    salt: string;
    hash: string;
  } {
    const salt = bcrypt.genSaltSync(16);
    const hash = bcrypt.hashSync(password, salt);

    return {
      salt,
      hash,
    };
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string, withPassword?: boolean): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: withPassword ? ['id', 'email', 'password'] : ['id', 'email'],
    });
  }

  async create(user: RegisterDto): Promise<User> {
    const { email, password, name } = user;
    const { salt, hash } = this.hashPasswordWithSalt(password);
    const newUser = await this.usersRepository.save({
      email,
      password: hash,
      name,
      salt,
    });

    return newUser;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
