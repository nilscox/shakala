import { normalized } from '@nilscox/redux-query';

import { schemas } from '../normalization';
import { User } from '../types';

type NormalizedUser = User;

export const usersReducer = normalized<NormalizedUser>(schemas, 'user');
