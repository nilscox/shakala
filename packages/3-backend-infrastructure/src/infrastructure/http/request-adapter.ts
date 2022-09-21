import { promisify } from 'util';

import { Request as ExpressRequest } from 'express';

import { Request, RequestFile, RequestSession } from './request';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export class RequestAdapter implements Request {
  params = new Map<string, string>();
  query = new URLSearchParams();
  body: unknown;
  session: RequestSession;
  file?: RequestFile;

  constructor(req: ExpressRequest) {
    for (const [key, value] of Object.entries(req.params)) {
      this.params.set(key, value);
    }

    for (const [key, value] of Object.entries(req.query)) {
      this.query.append(key, value as string);
    }

    this.body = req.body;
    this.session = new RequestSessionAdapter(req.session);

    if (req.file) {
      this.file = {
        // cspell:word originalname
        name: req.file.originalname,
        data: req.file.buffer,
        type: req.file.mimetype,
      };
    }
  }
}

class RequestSessionAdapter implements RequestSession {
  constructor(private session: ExpressRequest['session']) {}

  get userId() {
    return this.session.userId;
  }

  set userId(userId: string | undefined) {
    this.session.userId = userId;
  }

  async destroy() {
    await promisify(this.session.destroy.bind(this.session))();
  }
}
