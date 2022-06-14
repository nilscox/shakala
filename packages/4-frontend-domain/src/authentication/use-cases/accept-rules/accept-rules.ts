import { Thunk } from '../../../store';
import { setAcceptRulesWarningVisible, setRulesAccepted } from '../../actions/authentication.actions';
import { selectIsAcceptRulesWarningVisible } from '../../selectors/authentication.selectors';

export const acceptRules = (accepted: boolean): Thunk<void> => {
  return (dispatch, getState) => {
    const isWarningVisible = selectIsAcceptRulesWarningVisible(getState());

    if (!isWarningVisible) {
      dispatch(setAcceptRulesWarningVisible(true));
    } else {
      dispatch(setRulesAccepted(accepted));
    }
  };
};
