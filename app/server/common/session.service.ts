import {
  createCookieSessionStorage,
  createSession,
  Session as RemixSession,
  SessionStorage,
} from '@remix-run/node';
import { inject, injectable } from 'inversify';

export const SessionServiceToken = Symbol('SessionServiceToken');

interface Session {
  get(key: string): string | undefined;
  unset(key: string): void;
}

export interface SessionService<S extends Session = Session> {
  createSession(userId: string): S;
  getUserSession(request: Request): Promise<S | undefined>;
  getUserId(request: Request): Promise<string | undefined>;
  save(session: S): Promise<string>;
}

@injectable()
export class CookieSessionService implements SessionService<RemixSession> {
  constructor(
    @inject('session.secure')
    secure: boolean,
    @inject('session.secret')
    secret: string,
    @inject('session.sameSite')
    sameSite: 'lax' | 'strict' | 'none',
    @inject('session.maxAge')
    maxAge: number,
    @inject('session.httpOnly')
    httpOnly: boolean,
  ) {
    this.sessionStorage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        secure,
        secrets: [secret],
        sameSite,
        path: '/',
        maxAge,
        httpOnly,
      },
    });
  }

  private sessionStorage: SessionStorage;

  createSession(userId: string): RemixSession {
    return createSession({ userId });
  }

  async getUserSession(request: Request): Promise<RemixSession> {
    return this.sessionStorage.getSession(request.headers.get('Cookie'));
  }

  async getUserId(request: Request): Promise<string | undefined> {
    const session = await this.getUserSession(request);
    const userId = session.get('userId');

    if (!userId || typeof userId !== 'string') {
      return;
    }

    return userId;
  }

  async save(session: RemixSession): Promise<string> {
    return this.sessionStorage.commitSession(session);
  }
}

class StubSession {
  private attributes = new Map<string, string>();

  constructor(userId: string) {
    this.attributes.set('userId', userId);
  }

  get = this.attributes.get.bind(this.attributes);
  unset = this.attributes.delete.bind(this.attributes);
}

export class StubSessionService implements SessionService<StubSession> {
  session?: StubSession;

  createSession(userId: string): StubSession {
    return new StubSession(userId);
  }

  async getUserSession(_request: Request): Promise<StubSession | undefined> {
    return this.session;
  }

  async getUserId(_request: Request): Promise<string | undefined> {
    return;
  }

  async save(session: StubSession): Promise<string> {
    this.session = session;

    return 'cookie';
  }
}
