import * as ReactDOM from 'react-dom/client';
import { Hydrate } from 'react-query';

import { AppProviders } from '../app/app-providers';
import { Layout } from '../app/layout/layout';

import { PageContextClient } from './page-context';

import '@fontsource/open-sans/variable.css';
import '../styles.css';

export const clientRouting = true;
export const hydrationCanBeAborted = true;

let root: ReactDOM.Root;

export const NoLayout = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export function render(pageContext: PageContextClient) {
  const { Page, pageProps, dehydratedState, exports } = pageContext;
  const PageLayout = exports.Layout ?? NoLayout;

  const container = document.getElementById('app') as HTMLElement;

  const page = (
    <AppProviders context={pageContext}>
      <Hydrate state={dehydratedState}>
        <Layout>
          <PageLayout>
            <Page {...pageProps} />
          </PageLayout>
        </Layout>
      </Hydrate>
    </AppProviders>
  );

  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page);
  } else {
    root.render(page);
  }
}
