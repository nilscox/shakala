import { EntityActions, EntityAdapter } from '@nilscox/redux-kooltik';

import { NormalizedUser, User } from './user.types';

export class UserActions extends EntityActions<User> {
  private adapter = new EntityAdapter<NormalizedUser>((user) => user.id);

  constructor() {
    super('user');
  }

  setNormalizedUsers = this.action('set-users', this.adapter.setMany);
}

export const userActions = new UserActions();
