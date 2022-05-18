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
}

export interface SessionService<S extends Session = Session> {
  createSession(userId: string): S;
  getUserId(request: Request): Promise<string | null>;
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

  private async getUserSession(request: Request): Promise<RemixSession> {
    return this.sessionStorage.getSession(request.headers.get('Cookie'));
  }

  async getUserId(request: Request): Promise<string | null> {
    const session = await this.getUserSession(request);
    const userId = session.get('userId');

    if (!userId || typeof userId !== 'string') {
      return null;
    }

    return userId;
  }

  async save(session: RemixSession): Promise<string> {
    return this.sessionStorage.commitSession(session);
  }
}

export class StubSessionService implements SessionService<Session> {
  session: Session | null = null;

  createSession(userId: string): Session {
    return new Map([['userId', userId]]);
  }

  getSession(): Session | null {
    return this.session;
  }

  async getUserId(_request: Request): Promise<string | null> {
    return null;
  }

  async save(session: Session): Promise<string> {
    this.session = session;

    return 'cookie';
  }
}
