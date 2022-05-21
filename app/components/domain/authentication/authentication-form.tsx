import { useFetcher, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { FormError } from '~/components/elements/field-error';
import { useValidationErrors } from '~/hooks/use-validation-errors';

import { fieldErrorsHandler, formErrorHandler } from './error-handlers';
import { FormInputs } from './inputs';
import { AuthenticationMessage } from './message';
import { AuthenticationNavigation } from './navigation';
import {
  AuthenticationFormType,
  useAuthenticationFormType,
  useCloseAuthenticationForm,
} from './use-authentication-form-type';

const heading: Record<AuthenticationFormType, string> = {
  [AuthenticationFormType.login]: 'Connexion',
  [AuthenticationFormType.signup]: 'Inscription',
  [AuthenticationFormType.emailLogin]: 'Mot de passe oublié',
};

const cta: Record<AuthenticationFormType, string> = {
  [AuthenticationFormType.login]: 'Connexion',
  [AuthenticationFormType.signup]: 'Inscription',
  [AuthenticationFormType.emailLogin]: 'Envoyer',
};

export const AuthenticationForm = () => {
  const form = useAuthenticationFormType() as AuthenticationFormType;
  const closeForm = useCloseAuthenticationForm();

  const [params] = useSearchParams();
  const next = params.get('next');

  const authenticate = useFetcher();

  const [formError, fieldErrors, { clearFieldError, clearAllFormErrors }] = useValidationErrors(
    authenticate.data,
    fieldErrorsHandler,
    formErrorHandler,
  );

  const [didAcceptRules, setDidAcceptRules] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const isFormValid = () => {
    if (form === AuthenticationFormType.signup && !didAcceptRules) {
      return false;
    }

    return isValid;
  };

  useEffect(() => {
    if (authenticate.type === 'done' && authenticate.data?.id) {
      closeForm();
    }
  }, [authenticate, closeForm]);

  useEffect(() => {
    clearAllFormErrors();
  }, [form, clearAllFormErrors]);

  const action = () => {
    if (!next) {
      return `/user/${form}`;
    }

    return `/user/${form}?${new URLSearchParams({ next })}`;
  };

  return (
    <>
      <h2 className="text-xl font-bold text-primary">{heading[form]}</h2>

      <div>
        <AuthenticationMessage />
      </div>

      <authenticate.Form
        method="post"
        action={action()}
        onChange={(e) => setIsValid(e.currentTarget.checkValidity())}
      >
        <fieldset className="flex flex-col gap-2" disabled={authenticate.state === 'submitting'}>
          <AuthenticationNavigation />

          <FormInputs
            didAcceptRules={didAcceptRules}
            setDidAcceptRules={setDidAcceptRules}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />

          {formError && <FormError className="my-1 text-center">{formError}</FormError>}

          <Buttons canSubmit={isFormValid()} />
        </fieldset>
      </authenticate.Form>
    </>
  );
};

type ButtonsProps = {
  canSubmit: boolean;
};

const Buttons = ({ canSubmit }: ButtonsProps) => {
  const form = useAuthenticationFormType() as AuthenticationFormType;
  const closeForm = useCloseAuthenticationForm();

  return (
    <div className="flex flex-row gap-2 justify-end">
      <button type="reset" className="button-secondary" onClick={closeForm}>
        Annuler
      </button>
      <button type="submit" className="button-primary" disabled={!canSubmit}>
        {cta[form]}
      </button>
    </div>
  );
};
