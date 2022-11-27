import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

import { Layout } from '~/app/layout/layout';
import { ProfileLayout } from '~/app/layout/profile-layout';

import { ErrorBoundary, ErrorView } from '../utils/error-boundary';
import { PageProps } from '../utils/ssr';

import '@fontsource/montserrat/latin-400.css';
import '@fontsource/montserrat/latin-500.css';
import '@fontsource/montserrat/latin-600.css';
import '@fontsource/montserrat/latin-700.css';

import '../styles/tailwind.css';

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  const { pathname } = useRouter();
  const PageLayout = pathname.startsWith('/profil') ? ProfileLayout : Fragment;

  const { state, error } = pageProps;

  return (
    <Layout preloadedState={state}>
      <Head>
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
