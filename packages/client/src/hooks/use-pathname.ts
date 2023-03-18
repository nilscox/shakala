import { usePageContext } from '../app/app-providers';

export const usePathname = () => {
  return usePageContext().urlPathname;
};
