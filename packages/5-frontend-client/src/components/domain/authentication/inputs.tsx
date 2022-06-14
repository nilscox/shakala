import {
  AuthenticationField,
  selectAuthenticationFieldError,
  selectIsAuthenticationFieldVisible,
} from 'frontend-domain';
import { ReactNode } from 'react';

import { Input, InputProps } from '~/components/elements/input';
import { SearchParamLink } from '~/components/elements/search-param-link';
import { useSelector } from '~/hooks/use-selector';

import { AcceptRulesCheckbox } from './accept-rules-checkbox';

export const FormInputs = () => (
  <>
    <AuthenticationInput
      required
      field={AuthenticationField.email}
      type="email"
      placeholder="Email"
      minLength={3}
      errors={{
        email: "Format d'adresse email non valide",
        max: 'Adresse email trop longue',
        EmailAlreadyExists: (
          <>
            Cette adresse email est déjà utilisée. Voulez-vous vous{' '}
            <SearchParamLink param="auth" value="login">
              connecter
            </SearchParamLink>{' '}
            ?
          </>
        ),
      }}
    />

    <AuthenticationInput
      required
      field={AuthenticationField.password}
      type="password"
      placeholder="Mot de passe"
      autoComplete=""
      minLength={3}
      errors={{
        min: 'Mot de passe trop court',
        max: 'Mot de passe trop long :o',
      }}
    />

    <AuthenticationInput
      required
      field={AuthenticationField.nick}
      type="text"
      placeholder="Pseudo"
      minLength={3}
      errors={{
        min: 'Pseudo trop court',
        max: 'Pseudo trop long',
      }}
    />

    <AcceptRulesCheckbox />
  </>
);

type AuthenticationInputProps = InputProps & {
  field: AuthenticationField;
  errors: Record<string, ReactNode>;
};

const AuthenticationInput = ({ field, errors, ...props }: AuthenticationInputProps) => {
  const error = useSelector(selectAuthenticationFieldError, field);
  const visible = useSelector(selectIsAuthenticationFieldVisible, field);

  if (!visible) {
    return null;
  }

  return <Input name={field} className="w-full" error={error ? errors[error] : undefined} {...props} />;
};
