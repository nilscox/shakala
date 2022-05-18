import { Form, useFetcher } from '@remix-run/react';
import { useEffect, useState, useTransition } from 'react';

import { AcceptRulesCheckbox } from './accept-rules-checkbox';
import { AuthenticationMessage } from './message';
import { AuthenticationFormNavigation } from './navigation';

export enum AuthenticationFormType {
  login = 'login',
  signup = 'signup',
  emailLogin = 'email-login',
}

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

type AuthenticationFormProps = {
  form: AuthenticationFormType;
  onClose: () => void;
};

export const AuthenticationForm = ({ form, onClose }: AuthenticationFormProps) => {
  const authenticate = useFetcher();

  const [didAcceptRules, setDidAcceptRules] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const isFormValid = () => {
    if (form === AuthenticationFormType.signup && !didAcceptRules) {
      return false;
    }

    return isValid;
  };

  useEffect(() => {
    if (authenticate.type === 'done') {
      onClose();
    }
  }, [authenticate, onClose]);

  return (
    <>
      <h2 className="text-xl font-bold text-primary">{heading[form]}</h2>

      <div>
        <AuthenticationMessage form={form} />
      </div>

      <authenticate.Form
        method="post"
        action="/user"
        onChange={(e) => setIsValid(e.currentTarget.checkValidity())}
      >
        <fieldset className="flex flex-col gap-2" disabled={authenticate.state === 'submitting'}>
          <AuthenticationFormNavigation form={form} />

          <input type="hidden" name="authenticationType" value={form} />

          <input
            required
            name="email"
            type="email"
            placeholder="Email"
            className="py-1 px-2 w-full rounded border border-light-gray"
            minLength={3}
          />

          {form !== AuthenticationFormType.emailLogin && (
            <input
              required
              name="password"
              type="password"
              placeholder="Mot de passe"
              className="py-1 px-2 w-full rounded border border-light-gray"
              autoComplete=""
              minLength={3}
            />
          )}

          {form === AuthenticationFormType.signup && (
            <input
              required
              name="nick"
              type="text"
              placeholder="Pseudo"
              className="py-1 px-2 w-full rounded border border-light-gray"
              minLength={3}
            />
          )}

          {form === AuthenticationFormType.signup && (
            <AcceptRulesCheckbox checked={didAcceptRules} setChecked={setDidAcceptRules} />
          )}

          <div className="flex flex-row gap-2 justify-end">
            <button type="reset" className="button-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="button-primary" disabled={!isFormValid()}>
              {cta[form]}
            </button>
          </div>
        </fieldset>
      </authenticate.Form>
    </>
  );
};
