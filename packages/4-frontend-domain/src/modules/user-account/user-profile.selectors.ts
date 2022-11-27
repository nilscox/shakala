import { Selectors } from '@nilscox/redux-kooltik';

import { AppState } from '../../store';

import { UserProfile } from './user-profile.actions';

class UserProfileSelectors extends Selectors<AppState, UserProfile> {
  constructor() {
    super((state) => state.userAccount.profile);
  }

  fetchingAuthenticatedUser = this.propertySelector('fetchingAuthenticatedUser');
  authenticatedUser = this.propertySelector('authenticatedUser');
}

export const userProfileSelectors = new UserProfileSelectors();
