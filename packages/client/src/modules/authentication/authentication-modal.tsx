import { useEffect } from 'react';

import { Modal, useModalState } from '~/elements/modal';
import { useSearchParam } from '~/hooks/use-search-params';

import { AuthenticationForm } from './authentication-form';
import { useAuthenticationFormUnsafe } from './use-authentication-form';

export const AuthenticationModal = () => {
  const [authParam, setAuthParam] = useSearchParam('auth');
  const form = useAuthenticationFormUnsafe();
  const { isOpen, closeModal } = useModalState(form);

  useEffect(() => {
    if (authParam && !form) {
      setAuthParam(undefined);
    }
  }, [authParam, form, setAuthParam]);

  return (
    <Modal
      isOpen={isOpen}
      className="max-w-3"
      onRequestClose={closeModal}
      onAfterClose={() => setAuthParam(undefined)}
    >
      {form && <AuthenticationForm onClose={closeModal} />}
    </Modal>
  );
};
