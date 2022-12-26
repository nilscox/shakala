import { InvalidImageFormat } from 'shared';

import { AppThunk } from '../../../store';
import { userProfileActions } from '../user-profile.actions';

export const changeProfileImage = (image: File): AppThunk => {
  return async (dispatch, getState, { userProfileGateway, snackbarGateway }) => {
    try {
      const profileImage = await userProfileGateway.changeProfileImage(image);

      dispatch(userProfileActions.setUserProfileImage(profileImage));
    } catch (error) {
      if (error instanceof InvalidImageFormat) {
        snackbarGateway.error(formatInvalidFormatErrorMessage(error));
      } else {
        throw error;
      }
    }
  };
};

const formatInvalidFormatErrorMessage = (error: InvalidImageFormat) => {
  const { type, allowedTypes } = error.details;

  const firstAllowedTypes = allowedTypes.slice(0, -1);
  const lastAllowedType = allowedTypes.slice(-1);

  const allowedTypesList = `${firstAllowedTypes.join(', ')} et ${lastAllowedType}`;

  return `Le format d'image (${type}) n'est pas reconnu. Les formats autorisés sont ${allowedTypesList}.`;
};
