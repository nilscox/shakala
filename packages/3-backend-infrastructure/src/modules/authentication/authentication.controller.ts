import {
  EmailAlreadyExistsError,
  GetUserByEmailQuery,
  LoggerService,
  LoginCommand,
  NickAlreadyExistsError,
  SignupCommand,
  ValidateEmailAddressCommand,
} from 'backend-application';
import { EmailValidationFailed, EmailValidationFailedReason, InvalidCredentials, User } from 'backend-domain';
import { AuthUserDto, loginBodySchema, signupBodySchema } from 'shared';

import {
  CommandBus,
  ConfigService,
  Controller,
  Forbidden,
  NotImplemented,
  QueryBus,
  Request,
  Response,
  SessionService,
  ValidationError,
  ValidationService,
} from '../../infrastructure';
import { tryCatch } from '../../utils';

import { userToDto } from './authentication.dtos';

export class AuthenticationController extends Controller {
  constructor(
    logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly validationService: ValidationService,
    private readonly sessionService: SessionService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {
    super(logger, '/auth');
  }

  endpoints() {
    return {
      'POST /login': this.login,
      'POST /signup': this.signup,
      'GET  /signup/:userId/validate/:token': this.validateEmailAddress,
      'POST /request-login-email': this.requestLoginEmail,
      'POST /logout': this.logout,
      'GET  /me': this.getAuthenticatedUser,
    };
  }

  async login(req: Request): Promise<Response<AuthUserDto>> {
    await this.assertUnauthenticated(req);

    const body = await this.validationService.body(req, loginBodySchema);

    await tryCatch(async () => {
      await this.commandBus.execute(new LoginCommand(body.email, body.password));
    })
      .catch(InvalidCredentials, (error) => new Forbidden(error.message))
      .run();

    const user = await this.queryBus.execute<User>(new GetUserByEmailQuery(body.email));

    this.sessionService.setUser(req, user);

    return Response.ok(userToDto(user));
  }

  async signup(req: Request): Promise<Response<AuthUserDto>> {
    await this.assertUnauthenticated(req);

    const body = await this.validationService.body(req, signupBodySchema);

    await tryCatch(async () => {
      await this.commandBus.execute(new SignupCommand(body.nick, body.email, body.password));
    })
      .catch(EmailAlreadyExistsError, (error) =>
        ValidationError.from({ email: [error.message, error.details.email] }),
      )
      .catch(NickAlreadyExistsError, (error) =>
        ValidationError.from({ nick: [error.message, error.details.nick] }),
      )
      .run();

    const user = await this.queryBus.execute<User>(new GetUserByEmailQuery(body.email));

    this.sessionService.setUser(req, user);

    return Response.created(userToDto(user));
  }

  async validateEmailAddress(request: Request): Promise<Response> {
    const userId = request.params.get('userId') as string;
    const token = request.params.get('token') as string;
    const { appBaseUrl } = this.configService.app();

    const response = (status: string) => {
      return Response.redirect(`${appBaseUrl}/?${new URLSearchParams({ 'validate-email': status })}`, 307);
    };

    const mapEmailValidationFailedReason: Record<EmailValidationFailedReason, string> = {
      [EmailValidationFailedReason.invalidToken]: 'invalid-token',
      [EmailValidationFailedReason.alreadyValidated]: 'already-validated',
    };

    await tryCatch(() => this.commandBus.execute(new ValidateEmailAddressCommand(userId, token)))
      .catch(EmailValidationFailed, (error) => response(mapEmailValidationFailedReason[error.details.reason]))
      .run();

    return response('success');
  }

  async requestLoginEmail(): Promise<Response> {
    throw new NotImplemented();
  }

  async logout(req: Request): Promise<Response> {
    await this.sessionService.requireUser(req);
    this.sessionService.unsetUser(req);

    return Response.noContent();
  }

  async getAuthenticatedUser(request: Request): Promise<Response<AuthUserDto | undefined>> {
    const user = await this.sessionService.getUser(request);

    if (!user) {
      return Response.noContent();
    }

    return Response.ok(userToDto(user));
  }

  private async assertUnauthenticated(req: Request) {
    if (await this.sessionService.getUser(req)) {
      throw new Forbidden('AlreadyAuthenticated');
    }
  }
}
