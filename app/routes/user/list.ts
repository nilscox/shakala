import { json, LoaderFunction } from '@remix-run/node';

import container from '~/inversify.config.server';
import { UserRepository, UserRepositoryToken } from '~/server/data/user/user.repository';

export const loader: LoaderFunction = async () => {
  return json(await container.get<UserRepository>(UserRepositoryToken).findAll());
};
