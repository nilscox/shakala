import { json, LoaderFunction } from '@remix-run/node';

import { UserRepository, UserRepositoryToken } from '~/data/user.repository';
import container from '~/inversify.config.server';

export const loader: LoaderFunction = async () => {
  return json(await container.get<UserRepository>(UserRepositoryToken).findAll());
};
