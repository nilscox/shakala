import { useEffect } from 'react';

import { useSnackbar } from '~/components/elements/snackbar';
import { useSearchParam, useSetSearchParam } from '~/hooks/use-search-param';

export const useEmailValidationNotification = () => {
  const snackbar = useSnackbar();
  const emailValidationStatus = useSearchParam('validate-email');
  const setSearchParam = useSetSearchParam();

  useEffect(() => {
    if (!emailValidationStatus) {
      return;
    }

    switch (emailValidationStatus) {
      case 'success':
        snackbar.success('Votre adresse email a bien été validée. Bienvenue ! 🎉');
        break;

      case 'invalid-token':
        snackbar.error(
          "Le lien que vous avez utilisé n'est pas valide, votre adresse email n'a pas été validée.",
        );
        break;

      case 'already-validated':
        snackbar.error('Votre adresse email a déjà été validée.');
        break;

      default:
        snackbar.error("Quelque chose s'est mal passé, votre adresse email n'a pas été validée.");
    }

    setSearchParam('validate-email', undefined);
  }, [snackbar, emailValidationStatus, setSearchParam]);
};
