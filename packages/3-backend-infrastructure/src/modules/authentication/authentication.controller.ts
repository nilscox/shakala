import {
  AuthorizationError,
  EmailAlreadyExistsError,
  GetUserByEmailQuery,
  LoggerPort,
  LoginCommand,
  NickAlreadyExistsError,
  SignOutCommand,
  SignupCommand,
  ValidateEmailAddressCommand,
} from 'backend-application';
import { EmailValidationFailed, EmailValidationFailedReason, InvalidCredentials, User } from 'backend-domain';
import { AuthorizationErrorReason, AuthUserDto, loginBodySchema, signupBodySchema } from 'shared';

import {
  CommandBus,
  ConfigPort,
  Controller,
  Forbidden,
  NotImplemented,
  QueryBus,
  Request,
  Response,
  SessionPort,
  ValidationError,
  ValidationService,
} from '../../infrastructure';
import { execute } from '../../utils/execute';
import { UserPresenter } from '../user/user.presenter';

export class AuthenticationController extends Controller {
  constructor(
    logger: LoggerPort,
    private readonly config: ConfigPort,
    private readonly validation: ValidationService,
    private readonly session: SessionPort,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly userPresenter: UserPresenter,
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
    const body = await this.validation.body(req, loginBodySchema);

    await execute(this.commandBus)
      .command(new LoginCommand(body.email, body.password))
      .handle(InvalidCredentials, (error) => new Forbidden('InvalidCredentials', error.message))
      .run();

    const user = await this.queryBus.execute<User>(new GetUserByEmailQuery(body.email));

    this.session.setUser(req, user);

    return Response.ok(this.userPresenter.transformAuthenticatedUser(user));
  }

  async signup(req: Request): Promise<Response<AuthUserDto>> {
    const body = await this.validation.body(req, signupBodySchema);

    await execute(this.commandBus)
      .command(new SignupCommand(body.nick, body.email, body.password))
      .handle(EmailAlreadyExistsError, (error) =>
        // description: error.message
        ValidationError.from({ email: ['alreadyExists', error.details.email] }),
      )
      .handle(NickAlreadyExistsError, (error) =>
        // description: error.message
        ValidationError.from({ nick: ['alreadyExists', error.details.nick] }),
      )
      .run();

    const user = await this.queryBus.execute<User>(new GetUserByEmailQuery(body.email));

    this.session.setUser(req, user);

    return Response.created(this.userPresenter.transformAuthenticatedUser(user));
  }

  async validateEmailAddress(request: Request): Promise<Response> {
    const userId = request.params.get('userId') as string;
    const token = request.params.get('token') as string;
    const { appBaseUrl } = this.config.app();

    const response = (status: string) => {
      return Response.redirect(`${appBaseUrl}/?${new URLSearchParams({ 'validate-email': status })}`, 307);
    };

    const mapEmailValidationFailedReason: Record<EmailValidationFailedReason, string> = {
      [EmailValidationFailedReason.invalidToken]: 'invalid-token',
      [EmailValidationFailedReason.alreadyValidated]: 'already-validated',
    };

    await execute(this.commandBus)
      .command(new ValidateEmailAddressCommand(userId, token))
      .handle(EmailValidationFailed, (error) =>
        response(mapEmailValidationFailedReason[error.details.reason]),
      )
      .run();

    return response('success');
  }

  async requestLoginEmail(): Promise<Response> {
    throw new NotImplemented('email login request is not implemented yet');
  }

  async logout(req: Request): Promise<Response> {
    const user = await this.session.getUser(req);

    if (!user) {
      throw new AuthorizationError(AuthorizationErrorReason.unauthenticated);
    }

    await execute(this.commandBus).command(new SignOutCommand()).asUser(user).run();

    this.session.unsetUser(req);

    return Response.noContent();
  }

  async getAuthenticatedUser(request: Request): Promise<Response<AuthUserDto | undefined>> {
    const user = await this.session.getUser(request);

    if (!user) {
      return Response.noContent();
    }

    return Response.ok(this.userPresenter.transformAuthenticatedUser(user));
  }
}
