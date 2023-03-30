import { useInjection } from 'brandi-react';

export const useNavigate = () => {
  const router = useInjection(TOKENS.router);
  return router.navigate.bind(router);
};
