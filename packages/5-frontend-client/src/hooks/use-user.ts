'use client';

import { selectUserUnsafe } from 'frontend-domain';

import { useAppSelector } from './use-app-selector';

export const useUser = () => {
  return useAppSelector(selectUserUnsafe);
};
