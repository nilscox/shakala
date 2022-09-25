import { Thunk } from '../../../store';
import { selectUser } from '../../../user/user.selectors';
import { AuthenticationType } from '../../authentication.types';

export const requireAuthentication = (): Thunk<boolean> => {
  return (_dispatch, getState, { routerGateway }) => {
    if (selectUser(getState())) {
      return true;
    }

    routerGateway.currentAuthenticationForm = AuthenticationType.login;

    return false;
  };
};
