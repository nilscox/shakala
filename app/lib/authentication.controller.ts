import { json } from '@remix-run/node';
import { IsEmail, IsString, MaxLength, MinLength, validate } from 'class-validator';
import { inject, injectable } from 'inversify';

import {
  AuthenticationService,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from './authentication.service';
import { FormValues } from './form-values';
import { badRequest, forbidden } from './responses';
import { SessionService, SessionServiceToken } from './session.service';
import { ValidationError, ValidationService } from './validation.service';

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
    @inject(ValidationService)
    private readonly validationService: ValidationService,
  ) {}

  async login(input: FormData): Promise<Response> {
    const dto = new LoginDto({
      email: input.get('email'),
      password: input.get('password'),
    });

    try {
      await this.validationService.validate(dto);

      const user = await this.authenticationService.login(dto.email, dto.password);
      const session = await this.sessionService.createSession(user.id);

      return json(user, {
        headers: {
          'Set-Cookie': await this.sessionService.save(session),
        },
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest(error.formatted);
      }

      if (error instanceof InvalidCredentialsError) {
        return forbidden({ error: error.message });
      }

      throw error;
    }
  }

  async signup(input: FormData): Promise<Response> {
    const dto = new SignupDto({
      email: input.get('email'),
      password: input.get('password'),
      nick: input.get('nick'),
    });

    try {
      await this.validationService.validate(dto);

      const user = await this.authenticationService.signup(dto.email, dto.password, dto.nick);
      const session = await this.sessionService.createSession(user.id);

      return json(user, {
        status: 201,
        headers: {
          'Set-Cookie': await this.sessionService.save(session),
        },
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest(error.formatted);
      }

      if (error instanceof EmailAlreadyExistsError) {
        return badRequest({ error: error.message });
      }

      throw error;
    }
  }
}
