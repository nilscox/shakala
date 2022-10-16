import { useEffect } from 'react';

import { useSearchParam, useSetSearchParam } from '~/hooks/use-search-param';

export const useEmailValidationNotification = (
  success: (message: string) => void,
  error: (message: string) => void,
) => {
  const emailValidationStatus = useSearchParam('validate-email');
  const setSearchParam = useSetSearchParam();

  useEffect(() => {
    if (!emailValidationStatus) {
      return;
    }

    switch (emailValidationStatus) {
      case 'success':
        success('Votre adresse email a bien été validée. Bienvenue ! 🎉');
        break;

      case 'invalid-token':
        error("Le lien que vous avez utilisé n'est pas valide, votre adresse email n'a pas été validée.");
        break;

      case 'already-validated':
        error('Votre adresse email a déjà été validée.');
        break;

      default:
        error("Quelque chose s'est mal passé, votre adresse email n'a pas été validée.");
        break;
    }

    setSearchParam('validate-email', undefined);
  }, [success, error, emailValidationStatus, setSearchParam]);
};
