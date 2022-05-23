import { json, LoaderFunction } from '@remix-run/node';

import { UserRepository, UserRepositoryToken } from '~/server/data/user/user.repository';
import container from '~/server/inversify.config.server';

export const loader: LoaderFunction = async () => {
  return json(await container.get<UserRepository>(UserRepositoryToken).findAll());
};
