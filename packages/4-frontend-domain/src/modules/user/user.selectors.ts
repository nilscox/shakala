import { EntitySelectors } from '@nilscox/redux-kooltik';

import { AppState } from '../../store';

import { User } from './user.types';

class UserSelectors extends EntitySelectors<AppState, User> {
  constructor() {
    super('user', (state) => state.user);
  }
}

export const userSelectors = new UserSelectors();
