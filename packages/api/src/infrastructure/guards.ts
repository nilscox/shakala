/* eslint-disable @typescript-eslint/no-misused-promises */

import assert from 'assert';

import { TOKENS } from '@shakala/common';
import { getUser, GetUserResult } from '@shakala/user';
import { RequestHandler } from 'express';

import { container } from '../container';
import { jwt } from '../utils/jwt';

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      user: GetUserResult;
    }
  }
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const queryBus = container.get(TOKENS.queryBus);

  const cookies = req.cookies as Record<string, string> | undefined;
  const token = cookies?.token;

  if (!token) {
    res.status(401).end();
    return;
  }

  let userId;

  try {
    const result = jwt.decode<{ uid: string }>(token);

    assert(result.uid);
    userId = result.uid;
  } catch {
    res.status(401).end();
    return;
  }

  const user = await queryBus.execute(getUser({ id: userId }));

  if (!user) {
    res.status(500);
    res.json({
      code: 'InternalServerError',
      message: 'No user found for this token',
      details: { userId },
    });

    return;
  }

  req.userId = userId;
  req.user = user;

  next();
};

export const isUnauthenticated: RequestHandler = async (req, res, next) => {
  const cookies = req.cookies as Record<string, string> | undefined;
  const token = cookies?.token;

  if (token === undefined) {
    next();
    return;
  }

  try {
    jwt.decode(token);
    res.status(401).end();
  } catch {
    next();
  }
};

export const hasWriteAccess: RequestHandler = async (req, res, next) => {
  assert(req.user, 'hasWriteAccess: req.user is undefined');

  if (!req.user.emailValidated) {
    res.status(403);
    res.json({
      code: 'EmailNotValidated',
      message: 'user email must be validated to perform this action',
      details: { userId: req.userId },
    });

    return;
  }

  next();
};
