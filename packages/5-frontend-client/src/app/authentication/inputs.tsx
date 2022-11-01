import {
  AuthenticationField,
  isAuthenticationFieldVisible,
  selectAuthenticationFieldError,
} from 'frontend-domain';

import { FormField, FormFieldProps } from '~/elements/form-field';
import { Input } from '~/elements/input';
import { SearchParamLink } from '~/elements/search-param-link';
import { useAppSelector } from '~/hooks/use-app-selector';

import { AcceptRulesCheckbox } from './accept-rules-checkbox';
import { useAuthenticationForm } from './use-authentication-form';

export const FormInputs = () => (
  <>
    <AuthenticationFormField
      field={AuthenticationField.email}
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
    >
      <Input required type="email" placeholder="Email" minLength={3} className="w-full" />
    </AuthenticationFormField>

    <AuthenticationFormField
      field={AuthenticationField.password}
      errorsMap={{
        min: 'Mot de passe trop court',
        max: 'Mot de passe trop long :o',
      }}
    >
      <Input
        required
        type="password"
        placeholder="Mot de passe"
        autoComplete=""
        minLength={3}
        className="w-full"
      />
    </AuthenticationFormField>

    <AuthenticationFormField
      field={AuthenticationField.nick}
      errorsMap={{
        min: 'Pseudo trop court',
        max: 'Pseudo trop long',
        alreadyExists: 'Ce pseudo est déjà utilisé',
      }}
    >
      <Input required type="text" placeholder="Pseudo" minLength={3} className="w-full" />
    </AuthenticationFormField>

    <AcceptRulesCheckbox />
  </>
);

type AuthenticationFormFieldProps = FormFieldProps & {
  field: AuthenticationField;
};

export const AuthenticationFormField = ({ field, ...props }: AuthenticationFormFieldProps) => {
  const form = useAuthenticationForm();
  const visible = isAuthenticationFieldVisible(form, field);
  const error = useAppSelector(selectAuthenticationFieldError, field);

  if (!visible) {
    return null;
  }

  return <FormField name={field} consistentErrorHeight={false} error={error} {...props} />;
};
