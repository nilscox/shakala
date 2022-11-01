import { clsx } from 'clsx';
import {
  AuthenticationType,
  clearAllAuthenticationErrors,
  handleAuthenticate,
  handleAuthenticationFormChange,
  selectAuthenticationFormError,
  selectCanSubmitAuthenticationForm,
  selectIsAuthenticating,
} from 'frontend-domain';
import { FormEventHandler, useCallback, useEffect } from 'react';
import { get } from 'shared';

import { Button } from '~/elements/button';
import { FieldError } from '~/elements/form-field';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';

import { FormInputs } from './inputs';
import { AuthenticationMessage } from './message';
import { AuthenticationNavigation } from './navigation';
import { useAuthenticationForm } from './use-authentication-form';

const heading: Record<AuthenticationType, string> = {
  [AuthenticationType.login]: 'Connexion',
  [AuthenticationType.signup]: 'Inscription',
  [AuthenticationType.emailLogin]: 'Mot de passe oublié',
};

const cta: Record<AuthenticationType, string> = {
  [AuthenticationType.login]: 'Connexion',
  [AuthenticationType.signup]: 'Inscription',
  [AuthenticationType.emailLogin]: 'Envoyer',
};

type AuthenticationFormProps = {
  onClose: () => void;
};

export const AuthenticationForm = ({ onClose }: AuthenticationFormProps) => {
  const dispatch = useAppDispatch();

  const form = useAuthenticationForm();

  const isAuthenticating = useAppSelector(selectIsAuthenticating);
  const canSubmit = useAppSelector(selectCanSubmitAuthenticationForm, form);
  const formError = useAppSelector(selectAuthenticationFormError);

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

      const form = new FormData(event.currentTarget);

      dispatch(
        handleAuthenticate({
          email: form.get('email') as string,
          password: form.get('password') as string,
          nick: form.get('nick') as string,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(clearAllAuthenticationErrors());
  }, [dispatch, form]);

  return (
    <>
      <h2 className="py-0 text-primary">{heading[form]}</h2>

      <AuthenticationMessage />

      <form onChange={handleChange} onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-2" disabled={isAuthenticating}>
          <AuthenticationNavigation />

          <FormInputs />

          <FieldError className={clsx('my-1 text-center', !formError && 'hidden')}>
            {formError === 'InvalidCredentials' && 'Combinaison email / mot de passe non valide'}
          </FieldError>

          <Buttons canSubmit={canSubmit} onClose={onClose} />
        </fieldset>
      </form>
    </>
  );
};

type ButtonsProps = {
  canSubmit: boolean;
  onClose: () => void;
};

const Buttons = ({ canSubmit, onClose }: ButtonsProps) => {
  const form = useAuthenticationForm();

  return (
    <div className="flex flex-row justify-end gap-2">
      <Button secondary type="reset" onClick={onClose}>
        Annuler
      </Button>
      <Button primary type="submit" disabled={!canSubmit}>
        {cta[form]}
      </Button>
    </div>
  );
};
