import { Thunk } from '../../../store';
import { setIsAuthenticationModalOpen, setAuthenticationForm } from '../../actions/authentication.actions';
import { AuthenticationForm } from '../../authentication.types';

export const openAuthenticationModal = (form: AuthenticationForm): Thunk => {
  return (dispatch) => {
    dispatch(setIsAuthenticationModalOpen(true));
    dispatch(setAuthenticationForm(form));
  };
};
