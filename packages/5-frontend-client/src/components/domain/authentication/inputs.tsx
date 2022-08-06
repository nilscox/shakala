import {
  AuthenticationField,
  selectAuthenticationFieldError,
  selectIsAuthenticationFieldVisible,
} from 'frontend-domain';

import { FormField, FormFieldProps } from '~/components/elements/form-field';
import { Input } from '~/components/elements/input';
import { SearchParamLink } from '~/components/elements/search-param-link';
import { useSelector } from '~/hooks/use-selector';

import { AcceptRulesCheckbox } from './accept-rules-checkbox';

export const FormInputs = () => (
  <>
    <AuthenticationFormField
      field={AuthenticationField.email}
      errorsMap={{
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
  const visible = useSelector(selectIsAuthenticationFieldVisible, field);
  const error = useSelector(selectAuthenticationFieldError, field);

  if (!visible) {
    return null;
  }

  return <FormField name={field} consistentErrorHeight={false} error={error} {...props} />;
};
