import { clsx } from 'clsx';
import {
  acceptRules,
  AuthenticationField,
  isAuthenticationFieldVisible,
  selectAreRulesAccepted,
  selectIsAcceptRulesWarningVisible,
} from 'frontend-domain';

import { Link } from '~/elements/link';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';

import { useAuthenticationForm } from './use-authentication-form';

export const AcceptRulesCheckbox = () => {
  const warningVisible = useAppSelector(selectIsAcceptRulesWarningVisible);
  const form = useAuthenticationForm();
  const visible = isAuthenticationFieldVisible(form, AuthenticationField.acceptRulesCheckbox);
  const checked = useAppSelector(selectAreRulesAccepted);
  const dispatch = useAppDispatch();

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
        <Link href="/charte" target="_blank">
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
