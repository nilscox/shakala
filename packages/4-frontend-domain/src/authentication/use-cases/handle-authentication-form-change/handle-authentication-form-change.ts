import { Thunk } from '../../../store.types';
import {
  clearAuthenticationFieldError,
  clearAuthenticationFormError,
  setIsAuthenticationFormValid,
} from '../../authentication.actions';
import {
  selectAuthenticationFieldError,
  selectAuthenticationFormError,
} from '../../authentication.selectors';
import { isAuthenticationField } from '../../authentication.types';

// todo: early username availability check
export const handleAuthenticationFormChange = (isValid: boolean, field: string): Thunk => {
  return async (dispatch, getState) => {
    dispatch(setIsAuthenticationFormValid(isValid));

    if (selectAuthenticationFormError(getState())) {
      dispatch(clearAuthenticationFormError());
    }

    if (isAuthenticationField(field) && selectAuthenticationFieldError(getState(), field)) {
      dispatch(clearAuthenticationFieldError(field));
    }
  };
};
