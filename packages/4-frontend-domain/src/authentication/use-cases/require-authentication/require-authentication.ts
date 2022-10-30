import { Thunk } from '../../../store.types';
import { selectUserUnsafe } from '../../../user';
import { AuthenticationType } from '../../authentication.types';

export const requireAuthentication = (): Thunk<boolean> => {
  return (_dispatch, getState, { routerGateway }) => {
    if (selectUserUnsafe(getState())) {
      return true;
    }

    routerGateway.currentAuthenticationForm = AuthenticationType.login;

    return false;
  };
};
