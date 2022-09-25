import { Thunk } from '../../../store.types';
import { setAcceptRulesWarningVisible, setRulesAccepted } from '../../authentication.actions';
import { selectIsAcceptRulesWarningVisible } from '../../authentication.selectors';

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
