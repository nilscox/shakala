import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

import { Layout } from '~/app/layout/layout';
import { ProfileLayout } from '~/app/layout/profile-layout';

import { ErrorBoundary, ErrorView } from '../utils/error-boundary';
import { PageProps } from '../utils/ssr';

import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/400-italic.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/500-italic.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/600-italic.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/700-italic.css';

import '../styles/tailwind.css';

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  const { pathname } = useRouter();
  const PageLayout = pathname.startsWith('/profil') ? ProfileLayout : Fragment;

  const { state, error } = pageProps;

  return (
    <Layout preloadedState={state}>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="Échanges critiques" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <ErrorBoundary>
          <>
            {error && <ErrorView error={error} />}
            {!error && <Component />}
          </>
        </ErrorBoundary>
      </PageLayout>
    </Layout>
  );
}
