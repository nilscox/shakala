import { BaseError } from 'shared';

import { AppThunk } from '../../../store';
import { userProfileActions } from '../user-profile.actions';

export const InvalidImageFormat = BaseError.extend('invalid image format');

export const changeProfileImage = (image: File): AppThunk => {
  return async (dispatch, getState, { userProfileGateway, snackbarGateway }) => {
    try {
      const profileImage = await userProfileGateway.changeProfileImage(image);

      dispatch(userProfileActions.setUserProfileImage(profileImage));
    } catch (error) {
      if (error instanceof InvalidImageFormat) {
        snackbarGateway.error(
          "Le format d'image n'est pas reconnu. Les formats autorisés sont png, jpg et bmp.",
        );
      } else {
        throw error;
      }
    }
  };
};
