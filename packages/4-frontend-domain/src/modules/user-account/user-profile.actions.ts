import { Actions } from '@nilscox/redux-kooltik';

import { changeProfileImage } from './change-profile-image/change-profile-image.';
import { fetchAuthenticatedUser } from './fetch-authenticated-user/fetch-authenticated-user';
import { AuthenticatedUser } from './user-profile.types';

export type UserProfile = {
  fetchingAuthenticatedUser: boolean;
  authenticatedUser: AuthenticatedUser | null;
};

class UserProfileActions extends Actions<UserProfile> {
  constructor() {
    super('user-profile', {
      fetchingAuthenticatedUser: false,
      authenticatedUser: null,
    });
  }

  setFetching = this.createSetter('fetchingAuthenticatedUser');
  setAuthenticatedUser = this.createSetter('authenticatedUser');

  setUserProfileImage = this.action('user/set-profile-image', (state: UserProfile, imageUrl: string) => {
    if (state.authenticatedUser) {
      state.authenticatedUser.profileImage = imageUrl;
    }
  });

  fetchAuthenticatedUser = fetchAuthenticatedUser;
  changeProfileImage = changeProfileImage;
}

export const userProfileActions = new UserProfileActions();
