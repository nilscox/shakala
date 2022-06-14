import { SearchParamLink } from '~/components/elements/search-param-link';
import { FieldErrorsHandler, FormErrorHandler } from '~/hooks/use-validation-errors';

export const fieldErrorsHandler: FieldErrorsHandler = (data, setError) => {
  const email = () => {
    const email = data.email;

    if (email?.includes('maxLength')) {
      return 'Adresse email trop longue';
    }

    if (email?.includes('isEmail')) {
      return "Format d'adresse email non valide";
    }

    if (email?.includes('alreadyExists')) {
      return (
        <>
          Cette adresse email est déjà utilisée. Voulez-vous vous{' '}
          <SearchParamLink param="auth" value="login">
            connecter
          </SearchParamLink>{' '}
          ?
        </>
      );
    }
  };

  const password = () => {
    const password = data.password;

    if (password?.includes('minLength')) {
      return 'Mot de passe trop court';
    }

    if (password?.includes('maxLength')) {
      return 'Mot de passe trop long :o';
    }
  };

  const nick = () => {
    const nick = data.nick;

    if (nick?.includes('minLength')) {
      return 'Pseudo trop court';
    }

    if (nick?.includes('maxLength')) {
      return 'Pseudo trop long';
    }
  };

  setError('email', email());
  setError('password', password());
  setError('nick', nick());
};

export const formErrorHandler: FormErrorHandler = (data, setError) => {
  if (data?.error === 'InvalidCredentials') {
    setError('Combinaison email / mot de passe non valide');
  }
};
