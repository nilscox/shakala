import container from '~/server/inversify.config.server';
import { User } from '~/types';

import { UserEntity } from './data/user/user.entity';
import { UserService } from './user/user.service';

const transformUser = (user: UserEntity): User => {
  return {
    id: user.id,
    nick: user.nick,
    profileImage: user.profileImage ?? undefined,
  };
};

export const getUser = async (request: Request): Promise<User | undefined> => {
  const user = await container.get(UserService).getUser(request);

  if (user) {
    return transformUser(user);
  }
};

export const requireUser = async (request: Request): Promise<User> => {
  return transformUser(await container.get(UserService).requireUser(request));
};
