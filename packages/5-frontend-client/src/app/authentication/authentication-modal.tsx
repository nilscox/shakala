import { closeAuthenticationForm, selectUserUnsafe } from 'frontend-domain';
import { useCallback, useEffect, useState } from 'react';

import { Modal } from '~/elements/modal';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useSearchParam } from '~/hooks/use-search-param';

import { AuthenticationForm } from './authentication-form';

export const AuthenticationModal = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUserUnsafe);

  const isOpen = useSearchParam('auth') !== undefined;
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);

    const timeout = setTimeout(() => {
      dispatch(closeAuthenticationForm());
      setTimeout(() => setClosing(false), 0);
    }, 200);

    return () => clearTimeout(timeout);
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      handleClose();
    }
  }, [user, handleClose]);

  return (
    <Modal isOpen={isOpen && !closing} onRequestClose={handleClose} className="flex max-w-3 flex-col gap-4">
      {isOpen && <AuthenticationForm onClose={handleClose} />}
    </Modal>
  );
};
