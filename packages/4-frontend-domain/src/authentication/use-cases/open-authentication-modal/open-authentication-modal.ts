import { Thunk } from '../../../store';
import { setIsAuthenticationModalOpen, setAuthenticationForm } from '../../actions/authentication.actions';
import { AuthenticationType } from '../../authentication.types';

export const openAuthenticationModal = (form: AuthenticationType): Thunk => {
  return (dispatch) => {
    dispatch(setIsAuthenticationModalOpen(true));
    dispatch(setAuthenticationForm(form));
  };
};
