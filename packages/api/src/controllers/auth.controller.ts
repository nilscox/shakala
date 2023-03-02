import assert from 'assert';

import { CommandBus, GeneratorPort, QueryBus, TOKENS } from '@shakala/common';
import { signInBodySchema, signUpBodySchema } from '@shakala/shared';
import { checkUserPassword, createUser, getUser, InvalidCredentialsError } from '@shakala/user';
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
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {
    this.router.post('/sign-up', isUnauthenticated, this.signUp);
    this.router.post('/sign-in', isUnauthenticated, this.signIn);
    this.router.post('/sign-out', isAuthenticated, this.signOut);
  }

  signUp: RequestHandler = async (req, res) => {
    const body = await validateRequestBody(req, signUpBodySchema);
    const id = await this.generator.generateId();

    await this.commandBus.execute(createUser({ id, ...body }));

    res.status(201);
    res.set('Set-Cookie', this.setToken(id));
    res.send(id);
  };

  signIn: RequestHandler = async (req, res) => {
    const body = await validateRequestBody(req, signInBodySchema);

    try {
      await this.commandBus.execute(checkUserPassword(body));
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        error.status = 401;
      }

      throw error;
    }

    const user = await this.queryBus.execute(getUser({ email: body.email }));
    assert(user, 'expected user to exist');

    res.status(204);
    res.set('Set-Cookie', this.setToken(user.id));
    res.end();
  };

  signOut: RequestHandler = async (req, res) => {
    res.status(204);
    res.set('Set-Cookie', this.setCookie('token', '', 0));
    res.end();
  };

  private setCookie(key: string, value: string, maxAge: number) {
    const cookie = {
      [key]: value,
      'Max-Age': maxAge,
      Path: '/',
      SameSite: 'Strict',
      // todo: config
      // Secure: true,
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

injected(AuthController, TOKENS.generator, TOKENS.queryBus, TOKENS.commandBus);
