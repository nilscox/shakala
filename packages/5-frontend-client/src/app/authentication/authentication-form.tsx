import { DevTool } from '@hookform/devtools';
import { clsx } from 'clsx';
import {
  authenticationActions,
  AuthenticationForm as AuthenticationFormValues,
  AuthenticationFormType,
} from '@shakala/frontend-domain';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { InvalidCredentials } from '@shakala/shared';

import { Button } from '~/elements/button';
import { FieldError } from '~/elements/form-field';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useFormSubmit } from '~/hooks/use-form-submit';
import { useConfigValue } from '~/utils/config-provider';

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

type AuthenticationFormProps = {
  onClose: () => void;
};

export const AuthenticationForm = ({ onClose }: AuthenticationFormProps) => {
  const dispatch = useAppDispatch();
  const isDevelopment = useConfigValue('isDevelopment');

  const formType = useAuthenticationForm() as AuthenticationFormType;
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const form = useForm<AuthenticationFormValues>({
    defaultValues,
  });

  const handleSubmit = useFormSubmit(
    (data) => dispatch(authenticationActions.authenticate(data)),
    form.setError,
    (error) => {
      if (error instanceof InvalidCredentials) {
        setInvalidCredentials(true);
      }
    },
  );

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
        <fieldset className="flex flex-col gap-2" disabled={form.formState.isSubmitting}>
          <AuthenticationNavigation />

          <AuthenticationFields />

          <FieldError className={clsx('my-1 text-center', !invalidCredentials && 'hidden')}>
            {invalidCredentials && 'Combinaison email / mot de passe non valide'}
          </FieldError>

          <Buttons loading={form.formState.isSubmitting} onClose={onClose} />
        </fieldset>
      </form>
    </FormProvider>
  );
};

const cta: Record<AuthenticationFormType, string> = {
  [AuthenticationFormType.login]: 'Connexion',
  [AuthenticationFormType.signup]: 'Inscription',
  [AuthenticationFormType.emailLogin]: 'Envoyer',
};

type ButtonsProps = {
  loading: boolean;
  onClose: () => void;
};

const Buttons = ({ loading, onClose }: ButtonsProps) => {
  const form = useAuthenticationForm() as AuthenticationFormType;

  return (
    <div className="flex flex-row justify-end gap-2">
      <Button secondary type="reset" onClick={onClose}>
        Annuler
      </Button>
      <Button primary type="submit" loading={loading}>
        {cta[form]}
      </Button>
    </div>
  );
};
