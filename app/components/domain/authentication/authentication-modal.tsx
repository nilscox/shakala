import { useSearchParams } from 'react-router-dom';

import { Modal } from '~/components/elements/modal';

import { AuthenticationForm } from './authentication-form';
import { useAuthenticationFormType, useCloseAuthenticationForm } from './use-authentication-form-type';

export const AuthenticationModal = () => {
  const [params] = useSearchParams();
  const form = params.get('auth');

  const formDebounced = useAuthenticationFormType();
  const closeForm = useCloseAuthenticationForm();

  return (
    <Modal isOpen={form !== null} onRequestClose={closeForm}>
      {formDebounced && (
        <div className="flex flex-col gap-4 w-[480px]">
          <AuthenticationForm />
        </div>
      )}
    </Modal>
  );
};
