import { Thunk } from '../../../store';
import { AuthenticationForm } from '../../authentication.types';
import { selectUser } from '../../selectors/user.selectors';
import { openAuthenticationModal } from '../open-authentication-modal/open-authentication-modal';
export class DiscardedAuthenticationError extends Error {}

export const requireAuthentication = (): Thunk<boolean> => {
  return (dispatch, getState) => {
    if (selectUser(getState())) {
      return true;
    }

    dispatch(openAuthenticationModal(AuthenticationForm.login));

    return false;
  };
};
