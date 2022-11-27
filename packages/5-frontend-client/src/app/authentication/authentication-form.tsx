import { DevTool } from '@hookform/devtools';
import { clsx } from 'clsx';
import {
  authenticationActions,
  AuthenticationField,
  AuthenticationFormType,
  AuthenticationForm as AuthenticationFormValues,
  authenticationSelectors,
  InvalidCredentialsError,
  ValidationErrors,
} from 'frontend-domain';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormSetError } from 'react-hook-form';

import { Button } from '~/elements/button';
import { FieldError } from '~/elements/form-field';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import { getPublicConfig } from '~/utils/config';

import { AuthenticationFields } from './authentication-fields';
import { AuthenticationMessage } from './message';
import { AuthenticationNavigation } from './navigation';
import { useAuthenticationForm } from './use-authentication-form';

const defaultValues: AuthenticationFormValues = {
  email: '',
  password: '',
  nick: '',
  acceptRules: false,
};

const heading: Record<AuthenticationFormType, string> = {
  [AuthenticationFormType.login]: 'Connexion',
  [AuthenticationFormType.signup]: 'Inscription',
  [AuthenticationFormType.emailLogin]: 'Mot de passe oublié',
};

const { isDevelopment } = getPublicConfig();

type AuthenticationFormProps = {
  onClose: () => void;
};

export const AuthenticationForm = ({ onClose }: AuthenticationFormProps) => {
  const formType = useAuthenticationForm() as AuthenticationFormType;
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const form = useForm<AuthenticationFormValues>({ defaultValues });

  const isSubmitting = useAppSelector(authenticationSelectors.isSubmitting);
  const handleSubmit = useSubmit(form.setError, setInvalidCredentials);

  useEffect(() => {
    form.clearErrors();
    setInvalidCredentials(false);
  }, [formType, form]);

  return (
    <FormProvider {...form}>
      {isDevelopment && <DevTool control={form.control} />}

      <h2 className="py-0 text-primary">{heading[formType]}</h2>

      <AuthenticationMessage />

      <form onSubmit={form.handleSubmit(handleSubmit)} onChange={() => setInvalidCredentials(false)}>
        <fieldset className="flex flex-col gap-2" disabled={isSubmitting}>
          <AuthenticationNavigation />

          <AuthenticationFields />

          <FieldError className={clsx('my-1 text-center', !invalidCredentials && 'hidden')}>
            {invalidCredentials && 'Combinaison email / mot de passe non valide'}
          </FieldError>

          <Buttons canSubmit={true} onClose={onClose} />
        </fieldset>
      </form>
    </FormProvider>
  );
};

const useSubmit = (
  setError: UseFormSetError<AuthenticationFormValues>,
  setInvalidCredentials: (invalid: boolean) => void,
) => {
  const dispatch = useAppDispatch();

  return useCallback(
    async (data: AuthenticationFormValues) => {
      try {
        await dispatch(authenticationActions.authenticate(data));
      } catch (error) {
        // todo: factorize this
        if (error instanceof ValidationErrors) {
          for (const field of Object.values(AuthenticationField)) {
            setError(field, { message: error.getFieldError(field) });
          }
        } else if (error instanceof InvalidCredentialsError) {
          setInvalidCredentials(true);
        }
      }
    },
    [dispatch, setError, setInvalidCredentials],
  );
};

const cta: Record<AuthenticationFormType, string> = {
  [AuthenticationFormType.login]: 'Connexion',
  [AuthenticationFormType.signup]: 'Inscription',
  [AuthenticationFormType.emailLogin]: 'Envoyer',
};

type ButtonsProps = {
  canSubmit: boolean;
  onClose: () => void;
};

const Buttons = ({ canSubmit, onClose }: ButtonsProps) => {
  const form = useAuthenticationForm() as AuthenticationFormType;

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
