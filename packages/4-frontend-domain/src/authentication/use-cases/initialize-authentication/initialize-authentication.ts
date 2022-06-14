import { Thunk } from '../../../store';
import {
  clearAllAuthenticationErrors,
  setAuthenticationForm,
  setIsAuthenticationModalOpen,
} from '../../actions/authentication.actions';
import { isAuthenticationForm } from '../../authentication.types';
import { fetchAuthenticatedUser } from '../fetch-authenticated-user/fetch-authenticated-user';

export const initializeAuthentication = (): Thunk => {
  return async (dispatch, _getState, { routerGateway }) => {
    dispatch(setForm());

    routerGateway.onLocationChange(() => {
      dispatch(clearAllAuthenticationErrors());
      dispatch(setForm());
    });

    await dispatch(fetchAuthenticatedUser());
  };
};

const setForm = (): Thunk => {
  return (dispatch, _getState, { routerGateway, loggerGateway }) => {
    const form = routerGateway.getQueryParam('auth');

    if (!form) {
      dispatch(setAuthenticationForm(undefined));
      return;
    }

    if (isAuthenticationForm(form)) {
      dispatch(setIsAuthenticationModalOpen(true));
      dispatch(setAuthenticationForm(form));
    } else {
      loggerGateway.warn(`invalid authentication form type "${form}"`);
      routerGateway.removeQueryParam('auth');
    }
  };
};
