import { DevTool } from '@hookform/devtools';
import { useInjection } from 'brandi-react';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '~/elements/button';
import { FieldError } from '~/elements/form-field';
import { useSnackbar } from '~/elements/snackbar';
import { useNavigate } from '~/hooks/use-router';
import { useGetSearchParam } from '~/hooks/use-search-params';
import { useSubmit } from '~/hooks/use-submit';
import { getQueryKey } from '~/utils/query-key';

import { useConfigValue } from '../../hooks/use-config-value';

import { AuthenticationFields } from './authentication-fields';
import { AuthenticationMessage } from './message';
import { AuthenticationNavigation } from './navigation';
import { AuthenticationFields as AuthenticationFieldsType, AuthForm } from './types';
import { useAuthenticationForm } from './use-authentication-form';

const heading: Record<AuthForm, string> = {
  [AuthForm.signIn]: 'Connexion',
  [AuthForm.signUp]: 'Inscription',
  [AuthForm.emailLogin]: 'Mot de passe oublié',
};

type AuthenticationFormProps = {
  onClose: () => void;
};

export const AuthenticationForm = ({ onClose }: AuthenticationFormProps) => {
  const nextParam = useGetSearchParam('next');
  const isDevelopment = useConfigValue('isDevelopment');

  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const formType = useAuthenticationForm();

  const form = useForm<AuthenticationFieldsType>({
    defaultValues: {
      email: '',
      password: '',
      nick: '',
      acceptRules: false,
    },
  });

  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const handleSubmit = useSubmit(form, useSubmitAuthForm(), {
    invalidate: getQueryKey(TOKENS.authentication, 'getAuthenticatedUser'),
    onSuccess() {
      onClose();
      snackbar.success('Vous êtes maintenant connecté·e');

      if (nextParam) {
        navigate(nextParam);
      }
    },
    onError(error) {
      if (error.message === 'InvalidCredentials') {
        setInvalidCredentials(true);
        return;
      }

      if (error.message === 'AlreadyAuthenticated') {
        snackbar.warning('Vous êtes déjà connecté·e');
        return;
      }

      throw error;
    },
  });

  useEffect(() => {
    form.clearErrors();
    setInvalidCredentials(false);
  }, [form]);

  return (
    <FormProvider {...form}>
      {isDevelopment && <DevTool control={form.control} />}

      <h2 className="py-0 text-primary">{heading[formType]}</h2>

      <AuthenticationMessage />

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(handleSubmit)} onChange={() => setInvalidCredentials(false)}>
        <fieldset className="flex flex-col gap-2" disabled={form.formState.isSubmitting}>
          <AuthenticationNavigation />

          <AuthenticationFields />

          <FieldError
            error="Combinaison email / mot de passe non valide"
            className={clsx('my-1 text-center', !invalidCredentials && 'hidden')}
          />

          <Buttons form={formType} loading={form.formState.isSubmitting} onClose={onClose} />
        </fieldset>
      </form>
    </FormProvider>
  );
};

const cta: Record<AuthForm, string> = {
  [AuthForm.signIn]: 'Connexion',
  [AuthForm.signUp]: 'Inscription',
  [AuthForm.emailLogin]: 'Envoyer',
};

const useSubmitAuthForm = () => {
  const form = useAuthenticationForm();
  const snackbar = useSnackbar();
  const authenticationAdapter = useInjection(TOKENS.authentication);

  return async ({ nick, email, password }: AuthenticationFieldsType) => {
    if (form === AuthForm.signIn) {
      await authenticationAdapter.signIn(email, password);
    } else if (form === AuthForm.signUp) {
      await authenticationAdapter.signUp(nick, email, password);
    } else if (form === AuthForm.emailLogin) {
      snackbar.warning("La connexion sans mot de passe n'est pas encore disponible. Sorry!");
    }
  };
};

type ButtonsProps = {
  form: AuthForm;
  loading: boolean;
  onClose: () => void;
};

const Buttons = ({ form, loading, onClose }: ButtonsProps) => (
  <div className="flex flex-row justify-end gap-2">
    <Button secondary type="reset" onClick={onClose}>
      Annuler
    </Button>
    <Button primary type="submit" loading={loading}>
      {cta[form]}
    </Button>
  </div>
);
