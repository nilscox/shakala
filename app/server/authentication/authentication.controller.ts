import { json, redirect } from '@remix-run/node';
import { inject, injectable } from 'inversify';

import { User } from '~/types';

import { SessionService, SessionServiceToken } from '../common/session.service';
import { ValidationError, ValidationService } from '../common/validation.service';
import { badRequest, forbidden } from '../utils/responses';
import { SearchParams } from '../utils/search-params';
import { tryCatch } from '../utils/try-catch';

import { LoginDto, SignupDto } from './authentication.dtos';
import {
  AuthenticationService,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from './authentication.service';

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

  async login(request: Request): Promise<Response> {
    const form = await request.formData();

    const dto = new LoginDto({
      email: form.get('email'),
      password: form.get('password'),
    });

    return tryCatch(async () => {
      await this.validationService.validate(dto);

      const user = await this.authenticationService.login(dto.email, dto.password);
      const redirect = await this.redirectResponse(request, user);

      if (redirect) {
        return redirect;
      }

      return this.jsonResponse(200, user);
    })
      .catch(ValidationError, (error) => badRequest(error.formatted))
      .catch(InvalidCredentialsError, (error) => forbidden({ error: error.message }))
      .value();
  }

  async signup(request: Request): Promise<Response> {
    const form = await request.formData();

    const dto = new SignupDto({
      email: form.get('email'),
      password: form.get('password'),
      nick: form.get('nick'),
    });

    return tryCatch(async () => {
      await this.validationService.validate(dto);

      const user = await this.authenticationService.signup(dto.email, dto.password, dto.nick);
      const redirect = await this.redirectResponse(request, user);

      if (redirect) {
        return redirect;
      }

      return this.jsonResponse(201, user);
    })
      .catch(ValidationError, (error) => badRequest(error.formatted))
      .catch(EmailAlreadyExistsError, () =>
        badRequest(ValidationError.formatted({ email: ['alreadyExists'] })),
      )
      .value();
  }

  private async redirectResponse(request: Request, user: User) {
    const session = await this.sessionService.createSession(user.id);

    const params = new SearchParams(request);
    const next = params.getString('next');

    if (next) {
      return redirect(next, {
        headers: {
          'Set-Cookie': await this.sessionService.save(session),
        },
      });
    }
  }

  private async jsonResponse(status: number, user: User) {
    const session = await this.sessionService.createSession(user.id);

    return json(user, {
      status,
      headers: {
        'Set-Cookie': await this.sessionService.save(session),
      },
    });
  }

  async logout(request: Request): Promise<Response> {
    const session = await this.sessionService.getUserSession(request);

    if (!session) {
      return forbidden({ error: 'You must be authenticated' });
    }

    session.unset('userId');

    return redirect('/', {
      headers: {
        'Set-Cookie': await this.sessionService.save(session),
      },
    });
  }
}
