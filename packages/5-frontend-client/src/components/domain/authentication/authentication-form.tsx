import { clsx } from 'clsx';
import {
  AuthenticationType,
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

import { Button } from '~/components/elements/button';
import { FieldError } from '~/components/elements/form-field';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { FormInputs } from './inputs';
import { AuthenticationMessage } from './message';
import { AuthenticationNavigation } from './navigation';

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
    <div className="flex flex-row justify-end gap-2">
      <Button secondary type="reset" onClick={() => dispatch(closeAuthenticationForm())}>
        Annuler
      </Button>
      <Button primary type="submit" disabled={!canSubmit}>
        {cta[form]}
      </Button>
    </div>
  );
};
