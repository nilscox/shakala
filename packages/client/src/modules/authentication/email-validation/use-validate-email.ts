import { useEffect } from 'react';

import { HttpError } from '~/adapters/http/http-error';
import { useSnackbar } from '~/elements/snackbar';
import { useMutate } from '~/hooks/use-mutate';
import { useSearchParam } from '~/hooks/use-search-params';

export const useValidateEmail = () => {
  const snackbar = useSnackbar();
  const [token, setToken] = useSearchParam('email-validation-token');

  const validateEmail = useMutate(TOKENS.account, 'validateEmail', {
    onSuccess() {
      snackbar.success('Votre adresse email a bien été validée. Bienvenue ! 🎉');
    },
    onError(error) {
      if (!(error instanceof HttpError)) {
        throw error;
      }

      if (error.code === 'InvalidEmailValidationTokenError') {
        snackbar.error("Le lien que vous avez utilisé n'est pas valide.");
      } else if (error.code === 'EmailAlreadyValidatedError') {
        snackbar.error('Votre adresse email a déjà été validée.');
      } else {
        snackbar.error("Quelque chose s'est mal passé, votre adresse email n'a pas été validée.");
      }
    },
    onCompleted() {
      setToken(undefined);
    },
  });

  useEffect(() => {
    if (token) {
      validateEmail(token);
    }
  }, [token, validateEmail]);
};
