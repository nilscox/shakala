'use client';

import { selectUserUnsafe } from 'frontend-domain';

import { useSelector } from './use-selector';

export const useUser = () => {
  return useSelector(selectUserUnsafe);
};
