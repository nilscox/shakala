import { redirect } from '@remix-run/node';

import { UserRepository, UserRepositoryToken } from '~/data/user.repository';
import container from '~/inversify.config.server';
import { User } from '~/types';

import { SessionService, SessionServiceToken } from './common/session.service';

export const getUserId = async (request: Request): Promise<string | undefined> => {
  return container.get<SessionService>(SessionServiceToken).getUserId(request);
};

export const getUser = async (request: Request): Promise<User | undefined> => {
  const userId = await getUserId(request);
  const userRepository = container.get<UserRepository>(UserRepositoryToken);

  if (!userId) {
    return;
  }

  const user = await userRepository.findById(userId);

  if (!user) {
    // todo: handle this case
    return;
  }

  return user;
};

export const requireUser = async (request: Request): Promise<User> => {
  const user = await getUser(request);

  if (!user) {
    const url = new URL(request.url);
    const params = new URLSearchParams({
      auth: 'login',
      next: url.pathname,
      ...Object.fromEntries(url.searchParams),
    });

    throw redirect('/?' + params.toString());
  }

  return user;
};
