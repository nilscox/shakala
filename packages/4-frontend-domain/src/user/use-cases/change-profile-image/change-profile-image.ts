import { BaseError } from 'shared';

import { Thunk } from '../../../store';
import { updateUser } from '../../user.actions';

export const InvalidImageFormat = BaseError.extend('invalid image format');

export const changeProfileImage = (image: File): Thunk => {
  return async (dispatch, getState, { userGateway, snackbarGateway }) => {
    try {
      const profileImage = await userGateway.changeProfileImage(image);

      dispatch(updateUser({ profileImage }));
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
