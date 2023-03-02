import { StubQueryBus, TOKENS } from '@shakala/common';
import { getUser } from '@shakala/user';
import cookieParser from 'cookie-parser';
import { millisecondsToSeconds } from 'date-fns';
import express, { RequestHandler } from 'express';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { container } from '../container';
import { expect } from '../tests/expect';
import { FetchAgent } from '../tests/fetch-agent';
import { jwt } from '../utils/jwt';

import { isAuthenticated, isUnauthenticated } from './guards';

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
});

class Test {
  private queryBus = new StubQueryBus();
  private app = express();

  constructor(guard: RequestHandler) {
    this.app.use(cookieParser());

    this.app.use(guard, (req, res) => {
      res.end();
    });

    this.queryBus.register(getUser({ id: 'userId' }), { id: 'userId', email: '' });

    container.capture?.();
    container.bind(TOKENS.queryBus).toConstant(this.queryBus);
  }

  cleanup() {
    container.restore?.();
  }

  agent() {
    return new FetchAgent(this.app);
  }
}
