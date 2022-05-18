import { json } from '@remix-run/node';

const jsonResponseFactory = (status: number) => {
  return (body: unknown, init?: ResponseInit) => json(body, { status, ...init });
};

export const badRequest = jsonResponseFactory(400);
export const forbidden = jsonResponseFactory(401);
export const notImplemented = jsonResponseFactory(501);
