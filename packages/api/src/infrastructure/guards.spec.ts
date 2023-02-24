import { describe, it } from 'node:test';

import cookieParser from 'cookie-parser';
import { millisecondsToSeconds } from 'date-fns';
import express, { RequestHandler } from 'express';
import request from 'supertest';

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

  describe('isAuthenticated', () => {
    it('allows a request including a valid token', async () => {
      const token = jwt.encode({});
      const app = createApp(isAuthenticated);

      await request(app)
        .get('/')
        .set({ cookie: `token=${token}` })
        .expect(200);
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
