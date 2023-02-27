import expect from '@nilscox/expect';
import { create, InMemoryUserRepository, USER_TOKENS } from '@shakala/user';
import cookieParser from 'cookie-parser';
import { millisecondsToSeconds } from 'date-fns';
import express, { RequestHandler } from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { container } from '../container';
import { jwt } from '../utils/jwt';

import { isAuthenticated, isUnauthenticated } from './guards';

describe('[intg] guards', () => {
  const createApp = (middleware: RequestHandler) => {
    const app = express();

    app.use(cookieParser());
    app.use(middleware, (req, res) => {
      res.end();
    });

    return app;
  };

  beforeEach(() => {
    const userRepository = new InMemoryUserRepository([create.user({ id: 'userId' })]);

    container.capture?.();
    container.bind(USER_TOKENS.userRepository).toConstant(userRepository);
  });

  afterEach(() => {
    container.restore?.();
  });

  describe('isAuthenticated', () => {
    it('allows a request including a valid token', async () => {
      const token = jwt.encode({ uid: 'userId' });
      const app = createApp(isAuthenticated);

      await request(app)
        .get('/')
        .set({ cookie: `token=${token}` })
        .expect(200);
    });

    it('denies a request including an invalid token', async () => {
      const token = jwt.encode({});
      const app = createApp(isAuthenticated);

      await request(app)
        .get('/')
        .set({ cookie: `token=${token}` })
        .expect(401);
    });

    it('denies a request not including a cookie header', async () => {
      const app = createApp(isAuthenticated);

      await request(app).get('/').expect(401);
    });

    it('denies a request including an expired token', async () => {
      const token = jwt.encode({ exp: millisecondsToSeconds(Date.now()) - 1 });
      const app = createApp(isAuthenticated);

      await request(app)
        .get('/')
        .set({ cookie: `token=${token}` })
        .expect(401);
    });

    it('fails when the user does not exist', async () => {
      const token = jwt.encode({ uid: 'notUserId' });
      const app = createApp(isAuthenticated);

      const response = await request(app)
        .get('/')
        .set({ cookie: `token=${token}` })
        .expect(500);

      expect(response.body).toEqual({
        code: 'InternalServerError',
        message: 'No user found for this token',
        details: {
          userId: 'notUserId',
        },
      });
    });
  });

  describe('isUnauthenticated', () => {
    it('allows a request not including a token', async () => {
      const app = createApp(isUnauthenticated);

      await request(app).get('/').expect(200);
    });

    it('denies a request including valid token', async () => {
      const token = jwt.encode({});
      const app = createApp(isUnauthenticated);

      await request(app)
        .get('/')
        .set({ cookie: `token=${token}` })
        .expect(401);
    });
  });
});
