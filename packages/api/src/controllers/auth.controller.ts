/* eslint-disable @typescript-eslint/no-misused-promises */

import { CommandBus, CommandHandlerCommand, GeneratorPort } from '@shakala/common';
import { signInBodySchema, signUpBodySchema } from '@shakala/shared';
import { checkUserPassword, createUser, InvalidCredentialsError } from '@shakala/user';
import { millisecondsToSeconds } from 'date-fns';
import { secondsInMonth } from 'date-fns/constants';
import { Router } from 'express';

import { Dependencies } from '../dependencies';
import { isUnauthenticated, isAuthenticated } from '../infrastructure/guards';
import { validateRequestBody } from '../infrastructure/validate-request-body';
import { jwt } from '../utils/jwt';

export const authController = (generator: GeneratorPort, commandBus: CommandBus<Dependencies>): Router => {
  const router = Router();

  const setCookie = (key: string, value: string, maxAge: number) => {
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
  };

  const setToken = (userId: string, maxAge = 2 * secondsInMonth) => {
    const exp = millisecondsToSeconds(Date.now()) + maxAge;

    return setCookie('token', jwt.encode({ uid: userId, exp }), maxAge);
  };

  router.post('/sign-up', isUnauthenticated, async (req, res) => {
    const id = await generator.generateId();
    const body = await validateRequestBody(req, signUpBodySchema);

    const command: CommandHandlerCommand<typeof createUser> = {
      id,
      ...body,
    };

    await commandBus.execute(createUser, command);

    res.status(201);
    res.set('Set-Cookie', setToken('user'));
    res.send(id);
  });

  router.post('/sign-in', isUnauthenticated, async (req, res) => {
    try {
      await commandBus.execute(checkUserPassword, await validateRequestBody(req, signInBodySchema));
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        error.status = 401;
      }

      throw error;
    }

    res.status(204);
    res.set('Set-Cookie', setToken('user'));
    res.end();
  });

  router.post('/sign-out', isAuthenticated, async (req, res) => {
    const cookies = req.cookies as Record<string, string>;
    const token = cookies.token;

    res.status(204);
    res.set('Set-Cookie', setCookie('token', token, -1));
    res.end();
  });

  return router;
};
