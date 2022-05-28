import { useSearchParams } from 'react-router-dom';

import { Modal } from '~/components/elements/modal';

import { AuthenticationForm } from './authentication-form';
import { useCloseAuthenticationForm } from './use-authentication-form-type';

export const AuthenticationModal = () => {
  const [params] = useSearchParams();
  const form = params.get('auth');

  const closeForm = useCloseAuthenticationForm();

  return (
    <Modal isOpen={form !== null} onRequestClose={closeForm} className="flex flex-col gap-4 max-w-[32rem]">
      <AuthenticationForm />
    </Modal>
  );
};
