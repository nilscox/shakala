import { redirect } from '@remix-run/node';
import { inject, injectable } from 'inversify';

import { SessionService, SessionServiceToken } from '../common/session.service';
import { UserRepositoryToken, UserRepository } from '../data/user/user.repository';

import { User } from './user.entity';

@injectable()
export class UserService {
  constructor(
    @inject(SessionServiceToken)
    private readonly sessionService: SessionService,
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  findById = this.userRepository.findById.bind(this.userRepository);

  async getUser(request: Request): Promise<User | undefined> {
    const userId = await this.sessionService.getUserId(request);

    if (!userId) {
      return;
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      // todo: handle this case
      return;
    }

    return user;
  }

  async requireUser(request: Request) {
    const user = await this.getUser(request);

    if (!user) {
      const url = new URL(request.url);
      const params = new URLSearchParams({
        auth: 'login',
        next: url.pathname,
        ...Object.fromEntries(url.searchParams),
      });

      throw redirect([url.pathname, params.toString()].join('?'));
    }

    return user;
  }
}
