import { GetUserByIdQuery } from 'backend-application';
import { User } from 'backend-domain';

import { QueryBus } from '../../cqs/query-bus';
import { Request } from '../../http/request';

export interface SessionService {
  getUser(request: Request): Promise<User | undefined>;
  setUser(request: Request, user: User): void;
  unsetUser(request: Request): Promise<void>;
}

export class ExpressSessionService implements SessionService {
  constructor(private readonly queryBus: QueryBus) {}

  async getUser(request: Request): Promise<User | undefined> {
    const { userId } = request.session;

    if (!userId) {
      return;
    }

    const user = await this.queryBus.execute<User>(new GetUserByIdQuery(userId));

    if (!user) {
      console.warn(`Cannot find user from session, userId = "${userId}"`);
      await this.unsetUser(request);
    }

    return user;
  }

  setUser(request: Request, user: User): void {
    request.session.userId = user.id;
  }

  async unsetUser(request: Request): Promise<void> {
    await request.session.destroy();
  }
}
