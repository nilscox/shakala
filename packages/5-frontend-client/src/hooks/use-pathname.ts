import { routerSelectors } from 'frontend-domain';

import { useAppSelector } from './use-app-selector';

export const usePathname = () => {
  return useAppSelector(routerSelectors.pathname);
};
