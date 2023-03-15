import { useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { PageContext } from './types';

type AppProvidersProps = {
  context: PageContext;
  queryClient?: QueryClient;
  children: React.ReactNode;
};

export const AppProviders = ({ queryClient = new QueryClient(), children }: AppProvidersProps) => {
  const queryClientRef = useRef(queryClient);

  return <QueryClientProvider client={queryClientRef.current}>{children}</QueryClientProvider>;
};
