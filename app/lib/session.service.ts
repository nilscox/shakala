import { createCookieSessionStorage, createSession, Session, SessionStorage } from '@remix-run/node';
import { inject, injectable } from 'inversify';

export const SessionServiceToken = Symbol('SessionServiceToken');

export interface SessionService {
  getUserId(request: Request): Promise<string | null>;
  getSession(): Promise<Session>;
  saveSession(session: Session): Promise<string>;
}

@injectable()
export class CookieSessionService implements SessionService {
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

  async getUserSession(request: Request) {
    return this.sessionStorage.getSession(request.headers.get('Cookie'));
  }

  async getUserId(request: Request) {
    const session = await this.getUserSession(request);
    const userId = session.get('userId');

    if (!userId || typeof userId !== 'string') {
      return null;
    }

    return userId;
  }

  async getSession() {
    return this.sessionStorage.getSession();
  }

  async saveSession(session: Session) {
    return this.sessionStorage.commitSession(session);
  }
}

export class StubSessionService implements SessionService {
  getUserSession(request: Request): Promise<Session> {
    throw new Error('Method not implemented.');
  }

  getUserId(request: Request): Promise<string | null> {
    throw new Error('Method not implemented.');
  }

  async getSession(): Promise<Session> {
    return createSession();
  }

  saveSession(session: Session): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
