import expect from '@nilscox/expect';
import { BaseError, StubQueryBus, TOKENS } from '@shakala/common';
import { getUser } from '@shakala/user';
import cookieParser from 'cookie-parser';
import { millisecondsToSeconds } from 'date-fns';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { container } from '../container';
import { FetchAgent } from '../tests/fetch-agent';
import { jwt } from '../utils/jwt';

import { hasWriteAccess, isAuthenticated, isUnauthenticated, storeUserId } from './guards';

describe('[intg] guards', () => {
  describe('isAuthenticated', () => {
    let test: Test;

    beforeEach(() => {
      test = new Test(isAuthenticated);
    });

    afterEach(() => {
      container.restore?.();
    });

    it('allows a request including a valid token', async () => {
      const token = jwt.encode({ uid: 'userId' });
      const headers = new Headers({ cookie: `token=${token}` });

      await expect(test.agent().get('/', { headers })).toHaveStatus(200);
    });

    it('denies a request including an invalid token', async () => {
      const token = jwt.encode({});
      const headers = new Headers({ cookie: `token=${token}` });

      await expect(test.agent().get('/', { headers })).toHaveStatus(401);
    });

    it('denies a request not including a cookie header', async () => {
      await expect(test.agent().get('/')).toHaveStatus(401);
    });

    it('denies a request including an expired token', async () => {
      const token = jwt.encode({ exp: millisecondsToSeconds(Date.now()) - 1 });
      const headers = new Headers({ cookie: `token=${token}` });

      await expect(test.agent().get('/', { headers })).toHaveStatus(401);
    });

    it('fails when the user does not exist', async () => {
      const token = jwt.encode({ uid: 'notUserId' });
      const headers = { cookie: `token=${token}` };

      test.queryBus.on(getUser({ id: 'notUserId' })).return(undefined);

      const response = await expect(test.agent().get('/', { headers })).toHaveStatus(500);

      expect(await response.json()).toEqual({
        code: 'InternalServerError',
        message: 'No user found for this token',
        details: {
          userId: 'notUserId',
        },
      });
    });
  });

  describe('isUnauthenticated', () => {
    let test: Test;

    beforeEach(() => {
      test = new Test(isUnauthenticated);
    });

    afterEach(() => {
      container.restore?.();
    });

    it('allows a request not including a token', async () => {
      await expect(test.agent().get('/')).toHaveStatus(200);
    });

    it('denies a request including valid token', async () => {
      const token = jwt.encode({});
      const headers = new Headers({ cookie: `token=${token}` });

      await expect(test.agent().get('/', { headers })).toHaveStatus(401);
    });
  });

  describe('hasWriteAccess', () => {
    let test: Test;

    beforeEach(() => {
      test = new Test(isAuthenticated, hasWriteAccess);
    });

    afterEach(() => {
      container.restore?.();
    });

    it('allows a request from a valid user', async () => {
      await expect(test.as('userId').get('/')).toHaveStatus(200);
    });

    it('denies a request from a user whose email is not validated', async () => {
      test.queryBus
        .on(getUser({ id: 'userId' }))
        .return({ id: 'userId', email: '', nick: '', emailValidated: false });

      await expect(test.as('userId').get('/')).toHaveStatus(403);
    });
  });
});

class Test {
  readonly queryBus = new StubQueryBus();
  private readonly app = express();

  constructor(...guards: RequestHandler[]) {
    this.app.use(cookieParser());

    this.app.use(storeUserId);

    this.app.use(...guards, (req, res) => res.end());

    this.app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof BaseError) {
        res
          .status(err.status ?? 500)
          .json(err.serialize())
          .end();
      }
    });

    this.queryBus
      .on(getUser({ id: 'userId' }))
      .return({ id: 'userId', email: '', nick: '', emailValidated: true });

    container.capture?.();
    container.bind(TOKENS.queryBus).toConstant(this.queryBus);
  }

  as(userId: string): FetchAgent {
    const agent = this.agent();

    const token = jwt.encode({ uid: userId });
    agent.setHeader('Cookie', `token=${token}`);

    return agent;
  }

  cleanup() {
    container.restore?.();
  }

  agent() {
    return new FetchAgent(this.app);
  }
}
