import { clearAllAuthenticationErrors, closeAuthenticationForm } from 'frontend-domain';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Modal } from '~/components/elements/modal';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSearchParam } from '~/hooks/use-search-param';

import { AuthenticationForm } from './authentication-form';

export const AuthenticationModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSearchParam('auth') !== undefined;
  const [closing, setClosing] = useState(false);

  const location = useLocation();

  useEffect(() => {
    dispatch(clearAllAuthenticationErrors());
  }, [dispatch, location]);

  const handleClose = () => {
    setClosing(true);

    const timeout = setTimeout(() => {
      dispatch(closeAuthenticationForm());
      setTimeout(() => setClosing(false), 0);
    }, 200);

    return () => clearTimeout(timeout);
  };

  return (
    <Modal isOpen={isOpen && !closing} onRequestClose={handleClose} className="flex max-w-3 flex-col gap-4">
      {isOpen && <AuthenticationForm onClose={handleClose} />}
    </Modal>
  );
};
