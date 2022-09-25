import { Thunk } from '../../../store';
import { selectUser } from '../../../user/user.selectors';
import { AuthenticationType } from '../../authentication.types';
import { openAuthenticationModal } from '../open-authentication-modal/open-authentication-modal';

export const requireAuthentication = (): Thunk<boolean> => {
  return (dispatch, getState) => {
    if (selectUser(getState())) {
      return true;
    }

    dispatch(openAuthenticationModal(AuthenticationType.login));

    return false;
  };
};
