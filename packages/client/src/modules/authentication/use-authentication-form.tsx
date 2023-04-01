import { assert } from '@shakala/shared';

import { useGetSearchParam } from '~/hooks/use-search-params';

import { isAuthForm } from './types';

export const useAuthenticationFormUnsafe = () => {
  const authParam = useGetSearchParam('auth');

  return isAuthForm(authParam) ? authParam : undefined;
};

export const useAuthenticationForm = () => {
  const form = useAuthenticationFormUnsafe();

  assert(form);

  return form;
};
