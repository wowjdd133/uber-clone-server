import { AuthService } from './auth.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { LoginDto } from './dto/loginDto';
import { validate } from 'class-validator';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.authService.authenticate(req.sessionID);
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const body = plainToClass(LoginDto, request.body);
    const errors = await validate(body);

    const errorMessages = errors.flatMap(({ constraints }) =>
      constraints ? Object.values(constraints) : [],
    );
    if (errorMessages.length > 0) {
      response.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: errorMessages,
      });
    }

    const result = (await super.canActivate(context)) as boolean;
    await super.logIn(request);
    return result;
  }
}
