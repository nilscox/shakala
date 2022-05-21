import { ReactNode } from 'react';

import { Input } from '~/components/elements/input';

import { AcceptRulesCheckbox } from './accept-rules-checkbox';
import { AuthenticationFormType, useAuthenticationFormType } from './use-authentication-form-type';

type FormInputsProps = {
  didAcceptRules: boolean;
  setDidAcceptRules: (value: boolean) => void;
  fieldErrors: Record<string, ReactNode>;
  clearFieldError: (field: string) => void;
};

export const FormInputs = ({
  didAcceptRules,
  setDidAcceptRules,
  fieldErrors,
  clearFieldError,
}: FormInputsProps) => {
  const form = useAuthenticationFormType();

  return (
    <>
      <Input
        required
        name="email"
        type="email"
        placeholder="Email"
        className="w-full"
        minLength={3}
        error={fieldErrors.email}
        onChange={() => clearFieldError('email')}
      />

      {form !== AuthenticationFormType.emailLogin && (
        <Input
          required
          name="password"
          type="password"
          placeholder="Mot de passe"
          className="w-full"
          autoComplete=""
          minLength={3}
          error={fieldErrors.password}
          onChange={() => clearFieldError('password')}
        />
      )}

      {form === AuthenticationFormType.signup && (
        <Input
          required
          name="nick"
          type="text"
          placeholder="Pseudo"
          className="w-full"
          minLength={3}
          error={fieldErrors.nick}
          onChange={() => clearFieldError('nick')}
        />
      )}

      {form === AuthenticationFormType.signup && (
        <AcceptRulesCheckbox checked={didAcceptRules} setChecked={setDidAcceptRules} />
      )}
    </>
  );
};
