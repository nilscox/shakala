import { userProfileSelectors } from '@shakala/frontend-domain';

import { useAppSelector } from './use-app-selector';

export const useUser = () => {
  return useAppSelector(userProfileSelectors.authenticatedUser);
};
