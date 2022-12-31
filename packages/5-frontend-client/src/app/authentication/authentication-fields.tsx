import {
  AuthenticationField,
  AuthenticationFormType,
  AuthenticationForm,
  authenticationSelectors,
} from '@shakala/frontend-domain';
import { Controller } from 'react-hook-form';

import { FormField } from '~/elements/form-field';
import { Input } from '~/elements/input';
import { SearchParamLink } from '~/elements/search-param-link';

import { AcceptRulesCheckbox } from './accept-rules-checkbox';
import { useAuthenticationForm } from './use-authentication-form';

export const AuthenticationFields = () => (
  <>
    {/* todo: early username availability check */}
    <AuthenticationFormField
      name="email"
      type="email"
      placeholder="Email"
      minLength={3}
      errorsMap={{
        email: "Format d'adresse email non valide",
        max: 'Adresse email trop longue',
        alreadyExists: (
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

    <AuthenticationFormField
      required
      name="password"
      type="password"
      placeholder="Mot de passe"
      autoComplete=""
      minLength={3}
      className="w-full"
      errorsMap={{
        min: 'Mot de passe trop court',
        max: 'Mot de passe trop long :o',
      }}
    />

    <AuthenticationFormField
      required
      name="nick"
      type="text"
      placeholder="Pseudo"
      minLength={3}
      errorsMap={{
        min: 'Pseudo trop court',
        max: 'Pseudo trop long',
        alreadyExists: 'Ce pseudo est déjà utilisé',
      }}
    />

    <AcceptRulesCheckbox />
  </>
);

type AuthenticationFormFieldProps = React.ComponentProps<typeof Input> & {
  name: AuthenticationField;
  errorsMap: Record<string, React.ReactNode>;
};

export const AuthenticationFormField = ({ name, errorsMap, ...props }: AuthenticationFormFieldProps) => {
  const form = useAuthenticationForm();

  const visible = authenticationSelectors.isAuthenticationFieldVisible(form as AuthenticationFormType, name);

  if (!visible) {
    return null;
  }

  return (
    <Controller<AuthenticationForm>
      name={name}
      render={({ field, fieldState }) => (
        <FormField consistentErrorHeight={false} errorsMap={errorsMap} error={fieldState.error?.message}>
          <Input required className="w-full" {...props} {...(field as React.ComponentProps<typeof Input>)} />
        </FormField>
      )}
    />
  );
};
