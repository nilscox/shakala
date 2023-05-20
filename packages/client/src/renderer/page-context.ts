import { DehydratedState, QueryClient } from 'react-query';
import type {
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient,
  PageContextBuiltIn,
} from 'vite-plugin-ssr/types';

type Page = (pageProps: PageProps) => React.ReactElement;
type PageProps = object;

export type PrefetchQuery = (pageContext: PageContextServer, token?: string) => Promise<void>;

type PageContextCustom = {
  Page: Page;
  pageProps?: PageProps;
  routeParams: Record<string, string>;
  exports: {
    Layout?: React.ComponentType<React.PropsWithChildren>;
    queries?: PrefetchQuery[];
    authenticationRequired?: boolean;
  };
};

type ServerContext = {
  redirectTo?: string;
  token?: string;
  queryClient: QueryClient;
};

type ClientContext = {
  dehydratedState: DehydratedState;
};

export type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom & ServerContext;
export type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom & ClientContext;

export type PageContext = PageContextClient | PageContextServer;
