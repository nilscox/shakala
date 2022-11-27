import { authenticationActions, authenticationSelectors, userProfileSelectors } from 'frontend-domain';
import { useCallback, useEffect } from 'react';

import { Modal } from '~/elements/modal';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';

import { AuthenticationForm } from './authentication-form';

export const AuthenticationModal = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(userProfileSelectors.authenticatedUser);

  const auth = useAppSelector(authenticationSelectors.currentForm);
  const isOpen = auth !== undefined;

  const handleClose = useCallback(() => {
    dispatch(authenticationActions.closeAuthenticationForm());
  }, [dispatch]);

  useEffect(() => {
    // todo: do we want that?
    if (isOpen && user) {
      handleClose();
    }
  }, [isOpen, user, handleClose]);

  return (
    <Modal isOpen={isOpen} onRequestClose={handleClose} className="max-w-3">
      <AuthenticationForm onClose={handleClose} />
    </Modal>
  );
};
