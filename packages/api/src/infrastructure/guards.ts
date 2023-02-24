/* eslint-disable @typescript-eslint/no-misused-promises */

import assert from 'assert';

import { RequestHandler } from 'express';

import { jwt } from '../utils/jwt';

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const cookies = req.cookies as Record<string, string> | undefined;
  const token = cookies?.token;

  try {
    assert(token);
    jwt.decode(token);
    next();
  } catch {
    res.status(401).end();
  }
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
