import * as ReactDOMServer from 'react-dom/server';
import { dehydrate, Hydrate } from 'react-query';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';

import { Layout } from '~/app/layout/layout';
import { TOKENS } from '~/app/tokens';
import { AuthForm } from '~/modules/authentication/types';

import { AppProviders } from '../app/app-providers';
import { prefetchQuery } from '../utils/prefetch-query';

import type { PageContextServer } from './page-context';

export const passToClient = ['pageProps', 'routeParams', 'dehydratedState'];

const commonQueries = [prefetchQuery(TOKENS.authentication, 'getAuthenticatedUser')];

export async function render(pageContext: PageContextServer) {
  const { Page, pageProps, exports, queryClient, token } = pageContext;
  const PageLayout = exports.Layout ?? (({ children }) => <>{children}</>);

  const queries = [...commonQueries, ...(exports.queries ?? [])];

  await Promise.all(queries.map((query) => query(pageContext, token)));

  if (exports.authenticationRequired) {
    const result = checkAuthentication(pageContext);

    if (result) {
      return result;
    }
  }

  const dehydratedState = dehydrate(queryClient);

  const html = ReactDOMServer.renderToString(
    <Document>
      <AppProviders context={pageContext} queryClient={pageContext.queryClient}>
        <Hydrate state={dehydratedState}>
          <Layout>
            <PageLayout>
              <Page {...pageProps} />
            </PageLayout>
          </Layout>
        </Hydrate>
      </AppProviders>
    </Document>
  );

  const documentHtml = escapeInject`<!DOCTYPE html>${dangerouslySkipEscape(html)}`;

  return {
    documentHtml,
    pageContext: {
      dehydratedState,
    },
  };
}

const checkAuthentication = ({ queryClient, urlOriginal }: PageContextServer) => {
  const user = queryClient.getQueryData(['ApiAuthenticationAdapter', 'getAuthenticatedUser', []]);

  if (user) {
    return;
  }

  return {
    pageContext: {
      redirectTo: '/?' + new URLSearchParams({ auth: AuthForm.signIn, next: urlOriginal }),
    },
  };
};

type DocumentProps = {
  title?: string;
  children: React.ReactNode;
};

const Document = ({ title, children }: DocumentProps) => (
  <html lang="fr">
    <Head title={title} />
    <Body>{children}</Body>
  </html>
);

type HeadProps = {
  title?: string;
};

const Head = ({ title }: HeadProps) => (
  <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
);

type BodyProps = {
  children: React.ReactNode;
};

const Body = ({ children }: BodyProps) => (
  <body>
    <div id="app">{children}</div>
  </body>
);
