import { Normalized } from '@nilscox/redux-kooltik';
import { createFactory, randomId } from 'shared';

export type User = {
  id: string;
  nick: string;
  profileImage?: string;
};

export type NormalizedUser = Normalized<User>;

export const createUser = createFactory<User>(() => ({
  id: randomId(),
  nick: '',
}));
