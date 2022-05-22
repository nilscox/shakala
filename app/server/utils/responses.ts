import { json } from '@remix-run/node';

const responseFactory = (status: number) => {
  return (body?: unknown, init?: ResponseInit) => {
    if (body === undefined) {
      return new Response(undefined, { status, ...init });
    }

    return json(body, { status, ...init });
  };
};

export const ok = responseFactory(200);
export const created = responseFactory(201);
export const noContent = responseFactory(204);

export const badRequest = responseFactory(400);
export const notFound = responseFactory(404);
export const forbidden = responseFactory(401);
export const methodNotAllowed = responseFactory(405);

export const notImplemented = responseFactory(501);
