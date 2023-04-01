import { useEffect } from 'react';

import { Modal, useModalState } from '~/elements/modal';
import { useNavigate } from '~/hooks/use-router';
import { useSearchParam } from '~/hooks/use-search-params';
import { useUser } from '~/hooks/use-user';

import { AuthenticationForm } from './authentication-form';
import { useAuthenticationFormUnsafe } from './use-authentication-form';

export const AuthenticationModal = () => {
  const user = useUser();

  const [authParam, setAuthParam] = useSearchParam('auth');
  const [nextParam, setNextParam] = useSearchParam('next');

  const form = useAuthenticationFormUnsafe();
  const { isOpen, closeModal } = useModalState(form);

  const navigate = useNavigate();

  useEffect(() => {
    if (authParam && !form) {
      setAuthParam(undefined);
    }
  }, [authParam, form, setAuthParam]);

  useEffect(() => {
    if (user && nextParam) {
      closeModal();
      navigate(nextParam);
    }
  }, [user, nextParam, closeModal, navigate]);

  return (
    <Modal
      isOpen={isOpen}
      className="max-w-3"
      onRequestClose={closeModal}
      onAfterClose={() => {
        setAuthParam(undefined);
        setNextParam(undefined);
      }}
    >
      {form && <AuthenticationForm onClose={closeModal} />}
    </Modal>
  );
};
