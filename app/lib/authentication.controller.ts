import { Session } from '@remix-run/node';
import { IsEmail, IsString, MaxLength, MinLength, validate } from 'class-validator';
import { inject, injectable } from 'inversify';

import { User } from '~/types';

import {
  AuthenticationService,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from './authentication.service';
import { FormValues } from './form-values';
import { badRequest, forbidden } from './responses';
import { SessionService, SessionServiceToken } from './session.service';

class LoginDto {
  constructor(data: FormValues<LoginDto>) {
    Object.assign(this, data);
  }

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

class SignupDto {
  constructor(data: FormValues<SignupDto>) {
    Object.assign(this, data);
  }

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string;

  @IsString()
  @MinLength(6)
  nick!: string;
}

@injectable()
export class AuthenticationController {
  constructor(
    @inject(SessionServiceToken)
    private readonly sessionService: SessionService,
    @inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
  ) {}

  async login(input: FormData): Promise<[User, Session]> {
    const dto = new LoginDto({
      email: input.get('email'),
      password: input.get('password'),
    });

    const errors = await validate(dto);

    if (errors.length > 0) {
      throw badRequest(errors);
    }

    try {
      const user = await this.authenticationService.login(dto.email, dto.password);
      const session = await this.sessionService.getSession();

      session.set('userId', user.id);

      return [user, session];
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw forbidden({ error: error.message });
      }

      throw error;
    }
  }

  async signup(input: FormData): Promise<[User, Session]> {
    const dto = new SignupDto({
      email: input.get('email'),
      password: input.get('password'),
      nick: input.get('nick'),
    });

    const errors = await validate(dto);

    if (errors.length > 0) {
      throw badRequest(errors);
    }

    try {
      const user = await this.authenticationService.signup(dto.email, dto.password, dto.nick);
      const session = await this.sessionService.getSession();

      session.set('userId', user.id);

      return [user, session];
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw badRequest({ error: error.message });
      }

      throw error;
    }
  }
}
