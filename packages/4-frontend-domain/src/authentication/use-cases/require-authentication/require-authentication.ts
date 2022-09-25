import { Thunk } from '../../../store.types';
import { selectUser } from '../../../user';
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
