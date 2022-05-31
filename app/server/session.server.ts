import container from '~/server/inversify.config.server';
import { User as UserDto } from '~/types';

import { User } from './user/user.entity';
import { UserService } from './user/user.service';

const transformUser = (user: User): UserDto => {
  return {
    id: user.id,
    nick: user.nick.value,
    profileImage: user.profileImage.value ?? undefined,
  };
};

export const getUser = async (request: Request): Promise<UserDto | undefined> => {
  const user = await container.get(UserService).getUser(request);

  if (user) {
    return transformUser(user);
  }
};

export const requireUser = async (request: Request): Promise<UserDto> => {
  return transformUser(await container.get(UserService).requireUser(request));
};
