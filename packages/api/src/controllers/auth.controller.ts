import assert from 'assert';

import { GeneratorPort, TOKENS } from '@shakala/common';
import { signInBodySchema, signUpBodySchema } from '@shakala/shared';
import {
  CheckUserPasswordHandler,
  CreateUserCommand,
  CreateUserHandler,
  InvalidCredentialsError,
  UserRepository,
  USER_TOKENS,
} from '@shakala/user';
import { injected } from 'brandi';
import { millisecondsToSeconds } from 'date-fns';
import { secondsInMonth } from 'date-fns/constants';
import { RequestHandler, Router } from 'express';

import { isAuthenticated, isUnauthenticated } from '../infrastructure/guards';
import { validateRequestBody } from '../infrastructure/validate-request-body';
import { jwt } from '../utils/jwt';

export class AuthController {
  public readonly router: Router = Router();

  constructor(
    private readonly generator: GeneratorPort,
    // todo: remove
    private readonly userRepository: UserRepository,
    private readonly createUserHandler: CreateUserHandler,
    private readonly checkUserPasswordHandler: CheckUserPasswordHandler
  ) {
    this.router.post('/sign-up', isUnauthenticated, this.signUp);
    this.router.post('/sign-in', isUnauthenticated, this.signIn);
    this.router.post('/sign-out', isAuthenticated, this.signOut);
  }

  signUp: RequestHandler = async (req, res) => {
    const body = await validateRequestBody(req, signUpBodySchema);
    const id = await this.generator.generateId();

    const command: CreateUserCommand = {
      id,
      ...body,
    };

    await this.createUserHandler.handle(command);

    res.status(201);
    res.set('Set-Cookie', this.setToken(id));
    res.send(id);
  };

  signIn: RequestHandler = async (req, res) => {
    const body = await validateRequestBody(req, signInBodySchema);

    try {
      await this.checkUserPasswordHandler.handle(body);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        error.status = 401;
      }

      throw error;
    }

    const user = await this.userRepository.findByEmail(body.email);
    assert(user, 'expected user to exist');

    res.status(204);
    res.set('Set-Cookie', this.setToken(user.id));
    res.end();
  };

  signOut: RequestHandler = async (req, res) => {
    const cookies = req.cookies as Record<string, string>;
    const token = cookies.token;

    res.status(204);
    res.set('Set-Cookie', this.setCookie('token', token, -1));
    res.end();
  };

  private setCookie(key: string, value: string, maxAge: number) {
    const cookie = {
      [key]: value,
      'Max-Age': maxAge,
      Path: '/',
      SameSite: 'Strict',
      Secure: true,
      HttpOnly: true,
    };

    return Object.entries(cookie)
      .map(([key, value]) => (value === true ? key : [key, value].join('=')))
      .reduce((arr, item) => [...arr, item], new Array<string>())
      .join('; ');
  }

  private setToken(userId: string, maxAge = 2 * secondsInMonth) {
    const exp = millisecondsToSeconds(Date.now()) + maxAge;

    return this.setCookie('token', jwt.encode({ uid: userId, exp }), maxAge);
  }
}

injected(
  AuthController,
  TOKENS.generator,
  USER_TOKENS.userRepository,
  USER_TOKENS.createUserHandler,
  USER_TOKENS.checkUserPasswordHandler
);
