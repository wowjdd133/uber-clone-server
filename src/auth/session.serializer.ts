import { PassportSerializer } from '@nestjs/passport';
import { UserService } from './../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, id?: string) => void) {
    done(null, user.id);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error | null, payload: any) => void,
  ): Promise<any> {
    const user = await this.userService.findOne(payload);
    console.log(user, 'user');
    if (!user) {
      return done(
        new HttpException('User not found', HttpStatus.UNAUTHORIZED),
        null,
      );
    }
    done(null, payload);
  }
}
