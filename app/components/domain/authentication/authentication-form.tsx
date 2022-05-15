import { Form } from '@remix-run/react';
import { useState } from 'react';

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
  const [didAcceptRules, setDidAcceptRules] = useState(false);
  const [isValid, setIsValid] = useState(false);

  return (
    <>
      <h2 className="text-xl font-bold text-primary">{heading[form]}</h2>

      <div>
        <AuthenticationMessage form={form} />
      </div>

      <Form
        method="post"
        className="flex flex-col gap-2"
        onChange={(e) => setIsValid(e.currentTarget.checkValidity())}
      >
        <AuthenticationFormNavigation form={form} />

        <input
          type="email"
          placeholder="Email"
          className="py-1 px-2 w-full rounded border border-light-gray"
          minLength={3}
        />

        {form !== AuthenticationFormType.emailLogin && (
          <input
            type="password"
            placeholder="Mot de passe"
            className="py-1 px-2 w-full rounded border border-light-gray"
            autoComplete=""
            minLength={3}
          />
        )}

        {form === AuthenticationFormType.signup && (
          <input
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
          <input type="button" value="Annuler" className="button-secondary" onClick={onClose} />
          <input
            type="submit"
            value={cta[form]}
            className="button-primary"
            disabled={!isValid || !didAcceptRules}
          />
        </div>
      </Form>
    </>
  );
};
