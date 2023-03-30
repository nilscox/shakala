import { useCallback } from 'react';

import { useSnackbar } from '~/elements/snackbar';

export const useErrorHandler = () => {
  const snackbar = useSnackbar();

  return useCallback(
    (error: unknown) => {
      let message: string;

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else {
        message = "Une erreur s'est produite 😭";
      }

      snackbar.error(message);
    },
    [snackbar]
  );
};
