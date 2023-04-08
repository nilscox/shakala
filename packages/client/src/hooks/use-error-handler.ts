import { useCallback } from 'react';

import { HttpError } from '~/adapters/http/http-error';
import { useSnackbar } from '~/elements/snackbar';
import { AuthForm } from '~/modules/authentication/types';

import { useSetSearchParam } from './use-search-params';

export const useErrorHandler = () => {
  const setAuth = useSetSearchParam('auth');
  const snackbar = useSnackbar();

  return useCallback(
    (error: unknown) => {
      let message: string;

      if (error instanceof HttpError && error.code === 'UnauthorizedError') {
        setAuth(AuthForm.signIn);
        return;
      }

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else {
        message = "Une erreur s'est produite 😭";
      }

      snackbar.error(message);
    },
    [snackbar, setAuth]
  );
};
