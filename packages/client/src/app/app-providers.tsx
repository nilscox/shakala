import { ContainerProvider } from 'brandi-react';
import { QueryClient, QueryClientConfig, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { SnackbarProvider } from '~/elements/snackbar';
import { PageContext } from '~/renderer/page-context';

import { container } from './container';
import { PageContextProvider } from './page-context';
import { RouterProvider } from './router-context';

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
};

const clientQueryClient = new QueryClient(queryClientConfig);

type AppProvidersProps = {
  context: PageContext;
  queryClient?: QueryClient;
  children: React.ReactNode;
};

export const AppProviders = ({ context, queryClient = clientQueryClient, children }: AppProvidersProps) => (
  <ContainerProvider container={container}>
    <PageContextProvider value={context}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <RouterProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </RouterProvider>
      </QueryClientProvider>
    </PageContextProvider>
  </ContainerProvider>
);
