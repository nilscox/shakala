import { usePageContext } from '../app/app-providers';

export const useRouteParams = () => {
  return usePageContext().routeParams;
};

export const useRouteParam = (key: string) => {
  return useRouteParams()[key];
};
