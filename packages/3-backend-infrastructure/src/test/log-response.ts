import { ClientRequest } from 'http';

import { Request } from 'supertest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getClientRequest = ({ req }: any) => {
  return req as ClientRequest;
};

export const logRequestHeaders = (req: Request) => {
  void req.on('response', () => {
    const request = getClientRequest(req);

    for (const [key, value] of Object.entries(request.getHeaders())) {
      console.log([key, value].join(': '));
    }
  });
};

export const logResponseBody = (req: Request) => {
  void req.on('response', (res) => {
    console.dir(res.body, { depth: null });
  });
};
