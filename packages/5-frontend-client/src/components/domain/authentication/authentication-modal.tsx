import {
  closeAuthenticationForm,
  initializeAuthentication,
  selectAuthenticationFormUnsafe,
  selectIsAuthenticationModalOpen,
} from 'frontend-domain';
import { useEffect } from 'react';

import { Modal } from '~/components/elements/modal';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { AuthenticationForm } from './authentication-form';

export const AuthenticationModal = () => {
  const isOpen = useSelector(selectIsAuthenticationModalOpen);
  const form = useSelector(selectAuthenticationFormUnsafe);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuthentication());
  }, [dispatch]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => dispatch(closeAuthenticationForm())}
      className="flex max-w-3 flex-col gap-4"
    >
      {form && <AuthenticationForm />}
    </Modal>
  );
};
