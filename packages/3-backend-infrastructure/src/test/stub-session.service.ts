import { User } from 'backend-domain';

import { SessionService } from '../infrastructure';
import { Forbidden } from '../infrastructure/http/http-errors';
import { Request } from '../infrastructure/http/request';

export class StubSessionService implements SessionService {
  user?: User;

  constructor() {
    if (typeof beforeEach !== 'undefined') {
      beforeEach(() => {
        this.reset();
      });
    }
  }

  async getUser(): Promise<User | undefined> {
    return this.user;
  }

  async requireUser(): Promise<User> {
    if (!this.user) {
      throw new Forbidden();
    }

    return this.user;
  }

  setUser(_request: Request, user: User): void {
    this.user = user;
  }

  async unsetUser(): Promise<void> {
    this.reset();
  }

  reset() {
    delete this.user;
  }
}
