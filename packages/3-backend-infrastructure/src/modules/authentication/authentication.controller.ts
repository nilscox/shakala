import {
  AuthorizationError,
  EmailAlreadyExistsError,
  ExecutionContext,
  GetUserByEmailQuery,
  LoggerService,
  LoginCommand,
  NickAlreadyExistsError,
  SignupCommand,
  ValidateEmailAddressCommand,
} from 'backend-application';
import { EmailValidationFailed, EmailValidationFailedReason, InvalidCredentials, User } from 'backend-domain';
import { AuthorizationErrorReason, AuthUserDto, loginBodySchema, signupBodySchema } from 'shared';

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
import { UserPresenter } from '../user/user.presenter';

export class AuthenticationController extends Controller {
  constructor(
    logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly validationService: ValidationService,
    private readonly sessionService: SessionService,
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
    const body = await this.validationService.body(req, loginBodySchema);

    await tryCatch(async () => {
      await this.commandBus.execute(
        new LoginCommand(body.email, body.password),
        ExecutionContext.unauthenticated,
      );
    })
      .catch(InvalidCredentials, (error) => new Forbidden('InvalidCredentials', error.message))
      .run();

    const user = await this.queryBus.execute<User>(new GetUserByEmailQuery(body.email));

    this.sessionService.setUser(req, user);

    return Response.ok(this.userPresenter.transformAuthenticatedUser(user));
  }

  async signup(req: Request): Promise<Response<AuthUserDto>> {
    const body = await this.validationService.body(req, signupBodySchema);

    await tryCatch(async () => {
      await this.commandBus.execute(
        new SignupCommand(body.nick, body.email, body.password),
        ExecutionContext.unauthenticated,
      );
    })
      .catch(EmailAlreadyExistsError, (error) =>
        // description: error.message
        ValidationError.from({ email: ['alreadyExists', error.details.email] }),
      )
      .catch(NickAlreadyExistsError, (error) =>
        // description: error.message
        ValidationError.from({ nick: ['alreadyExists', error.details.nick] }),
      )
      .run();

    const user = await this.queryBus.execute<User>(new GetUserByEmailQuery(body.email));

    this.sessionService.setUser(req, user);

    return Response.created(this.userPresenter.transformAuthenticatedUser(user));
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

    await tryCatch(() =>
      this.commandBus.execute(
        new ValidateEmailAddressCommand(userId, token),
        ExecutionContext.unauthenticated,
      ),
    )
      .catch(EmailValidationFailed, (error) => response(mapEmailValidationFailedReason[error.details.reason]))
      .run();

    return response('success');
  }

  async requestLoginEmail(): Promise<Response> {
    throw new NotImplemented('email login request is not implemented yet');
  }

  async logout(req: Request): Promise<Response> {
    const user = await this.sessionService.getUser(req);

    if (!user) {
      throw new AuthorizationError(AuthorizationErrorReason.unauthenticated);
    }

    this.sessionService.unsetUser(req);

    return Response.noContent();
  }

  async getAuthenticatedUser(request: Request): Promise<Response<AuthUserDto | undefined>> {
    const user = await this.sessionService.getUser(request);

    if (!user) {
      return Response.noContent();
    }

    return Response.ok(this.userPresenter.transformAuthenticatedUser(user));
  }
}
