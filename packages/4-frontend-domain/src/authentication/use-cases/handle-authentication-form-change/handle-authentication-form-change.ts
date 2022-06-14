import { Thunk } from '../../../store';
import {
  clearAuthenticationFieldError,
  clearAuthenticationFormError,
  setIsAuthenticationFormValid,
} from '../../actions/authentication.actions';
import { isAuthenticationField } from '../../authentication.types';
import {
  selectAuthenticationFieldError,
  selectAuthenticationFormError,
} from '../../selectors/authentication.selectors';

// todo: early username availability check
export const handleAuthenticationFormChange = (_form: FormData, isValid: boolean, field: string): Thunk => {
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
