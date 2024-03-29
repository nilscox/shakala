import { usePageContext } from '~/app/page-context';

export const useRouteParams = () => {
  return usePageContext().routeParams;
};

export const useRouteParam = (key: string) => {
  return useRouteParams()[key];
};
