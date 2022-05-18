import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Modal } from '~/components/elements/modal';

import { AuthenticationForm, AuthenticationFormType } from './authentication-form';

export const AuthenticationModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const form = searchParams.get('auth');
  const [cachedForm, setCachedForm] = useState(form);

  const handleClose = useCallback(() => {
    searchParams.delete('auth');
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  if (form && form !== 'login' && form !== 'signup' && form !== 'email-login') {
    handleClose();
  }

  useEffect(() => {
    if (form !== null) {
      setCachedForm(form);
    }
  }, [form]);

  return (
    <Modal isOpen={form !== null} onRequestClose={handleClose}>
      <div className="flex flex-col gap-4 w-[480px]">
        <AuthenticationForm form={(form as AuthenticationFormType) ?? cachedForm} onClose={handleClose} />
      </div>
    </Modal>
  );
};
