import { TOKENS } from '~/app/tokens';

import { useQuery } from './use-query';

export const useUser = () => {
  return useQuery(TOKENS.authentication, 'getAuthenticatedUser');
};
