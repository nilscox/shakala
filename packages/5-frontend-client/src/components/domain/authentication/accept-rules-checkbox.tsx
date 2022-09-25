import { clsx } from 'clsx';
import {
  acceptRules,
  AuthenticationField,
  isAuthenticationFieldVisible,
  selectAreRulesAccepted,
  selectIsAcceptRulesWarningVisible,
} from 'frontend-domain';

import { Link } from '~/components/elements/link';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { useAuthenticationForm } from './use-authentication-form';

export const AcceptRulesCheckbox = () => {
  const warningVisible = useSelector(selectIsAcceptRulesWarningVisible);
  const form = useAuthenticationForm();
  const visible = isAuthenticationFieldVisible(form, AuthenticationField.acceptRulesCheckbox);
  const checked = useSelector(selectAreRulesAccepted);
  const dispatch = useDispatch();

  if (!visible) {
    return null;
  }

  return (
    <div>
      <input
        required
        id="accept-rules"
        type="checkbox"
        checked={checked}
        onChange={(event) => dispatch(acceptRules(event.target.checked))}
      />
      <label htmlFor="accept-rules" className="ml-2 inline-block">
        J'accepte{' '}
        <Link to="/charte" target="_blank">
          la charte
        </Link>
      </label>

      <div className={clsx('my-2', !warningVisible && 'hidden')}>
        Il est important que chaque membre ait pris connaissance de la charte. Si ce n'est pas encore fait,
        accordez <strong>5 minutes</strong> à sa lecture avant de vous inscrire.
      </div>
    </div>
  );
};
