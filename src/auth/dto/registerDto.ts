import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';

export class RegisterDto extends PickType(User, [
  'email',
  'password',
  'name',
]) {}
