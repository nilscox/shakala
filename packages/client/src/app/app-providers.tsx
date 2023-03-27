import { ContainerProvider } from 'brandi-react';
import { createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { assert } from '../utils/assert';

import { container } from './container';
import { PageContext } from './page-context';

const clientQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

type AppProvidersProps = {
  context: PageContext;
  queryClient?: QueryClient;
  children: React.ReactNode;
};

export const AppProviders = ({ context, queryClient = clientQueryClient, children }: AppProvidersProps) => (
  <ContainerProvider container={container}>
    <pageContext.Provider value={context}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        {children}
      </QueryClientProvider>
    </pageContext.Provider>
  </ContainerProvider>
);

const pageContext = createContext<PageContext>(null as never);

export const usePageContext = () => {
  const context = useContext(pageContext);

  assert(context);

  return context;
};
