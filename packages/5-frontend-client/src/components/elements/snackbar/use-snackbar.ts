import { useCallback, useMemo } from 'react';

import { useSnackbarContext } from './snackbar-provider';
import { SnackType } from './snackbar.types';

export const useSnackbar = () => {
  const { addSnack } = useSnackbarContext();

  if (addSnack === null) {
    throw new Error('Missing SnackbarProvider');
  }

  const register = useCallback(
    (type: SnackType) => (message: string) => {
      addSnack({
        id: Math.random().toString(36).slice(-6),
        type,
        transition: 'in',
        message,
      });
    },
    [addSnack],
  );

  return useMemo(
    () => ({
      success: register(SnackType.success),
      info: register(SnackType.info),
      warning: register(SnackType.warning),
      error: register(SnackType.error),
    }),
    [register],
  );
};
