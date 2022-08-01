import clsx from 'clsx';
import {
  AuthenticationForm as AuthenticationFormType,
  closeAuthenticationForm,
  handleAuthenticate,
  handleAuthenticationFormChange,
  selectAuthenticationForm,
  selectAuthenticationFormError,
  selectCanSubmitAuthenticationForm,
  selectIsAuthenticating,
} from 'frontend-domain';
import { FormEventHandler, useCallback } from 'react';
import { get } from 'shared';

import { FormError } from '~/components/elements/field-error';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { FormInputs } from './inputs';
import { AuthenticationMessage } from './message';
import { AuthenticationNavigation } from './navigation';

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
  const form = useSelector(selectAuthenticationForm);
  const isAuthenticating = useSelector(selectIsAuthenticating);
  const canSubmit = useSelector(selectCanSubmitAuthenticationForm);
  const formError = useSelector(selectAuthenticationFormError);
  const dispatch = useDispatch();

  const handleChange = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      const isValid = event.currentTarget.checkValidity();
      const field = get(event.target, 'name') as string;

      dispatch(handleAuthenticationFormChange(isValid, field));
    },
    [dispatch],
  );

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      dispatch(handleAuthenticate(new FormData(event.currentTarget)));
    },
    [dispatch],
  );

  return (
    <>
      <h2 className="text-xl font-bold text-primary">{heading[form]}</h2>

      <AuthenticationMessage />

      <form onChange={handleChange} onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-2" disabled={isAuthenticating}>
          <AuthenticationNavigation />

          <FormInputs />

          <FormError className={clsx('my-1 text-center', !formError && 'hidden')}>
            {formError === 'InvalidCredentials' && 'Combinaison email / mot de passe non valide'}
          </FormError>

          <Buttons canSubmit={canSubmit} />
        </fieldset>
      </form>
    </>
  );
};

type ButtonsProps = {
  canSubmit: boolean;
};

const Buttons = ({ canSubmit }: ButtonsProps) => {
  const form = useSelector(selectAuthenticationForm);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-row gap-2 justify-end">
      <button type="reset" className="button-secondary" onClick={() => dispatch(closeAuthenticationForm())}>
        Annuler
      </button>
      <button type="submit" className="button-primary" disabled={!canSubmit}>
        {cta[form]}
      </button>
    </div>
  );
};
