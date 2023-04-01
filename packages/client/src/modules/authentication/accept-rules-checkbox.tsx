import { clsx } from 'clsx';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { Link } from '~/elements/link';

import { isAuthenticationFieldVisible } from './authentication-fields';
import { AuthenticationFields } from './types';
import { useAuthenticationForm } from './use-authentication-form';

export const AcceptRulesCheckbox = () => {
  const [warningVisible, setWarningVisible] = useState(false);

  const form = useAuthenticationForm();
  const visible = isAuthenticationFieldVisible(form, 'acceptRules');

  if (!visible) {
    return null;
  }

  return (
    <div>
      <Controller<AuthenticationFields, 'acceptRules'>
        name="acceptRules"
        render={({ field: { value, onChange, ...field } }) => (
          <input
            required
            type="checkbox"
            id="accept-rules"
            checked={value}
            onChange={(event) => {
              if (!warningVisible) {
                setWarningVisible(true);
              } else {
                onChange(event);
              }
            }}
            {...field}
          />
        )}
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
