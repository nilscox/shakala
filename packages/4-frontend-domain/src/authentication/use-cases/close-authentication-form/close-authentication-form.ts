import { Thunk } from '../../../store';
import { setAuthenticationForm, setIsAuthenticationModalOpen } from '../../actions/authentication.actions';

export const closeAuthenticationForm = (): Thunk<void> => {
  return (dispatch, _getState, { timerGateway, routerGateway }) => {
    dispatch(setIsAuthenticationModalOpen(false));

    timerGateway.setTimeout(() => {
      routerGateway.removeQueryParam('auth');
      dispatch(setAuthenticationForm());
    }, 200);
  };
};
