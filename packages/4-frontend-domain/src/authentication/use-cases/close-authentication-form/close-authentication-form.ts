import { Thunk } from '../../../store.types';

export const closeAuthenticationForm = (): Thunk<void> => {
  return (_dispatch, _getState, { routerGateway }) => {
    routerGateway.currentAuthenticationForm = undefined;
  };
};
