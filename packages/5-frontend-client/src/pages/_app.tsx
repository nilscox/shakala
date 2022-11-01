import { State } from 'frontend-domain';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';

import { Layout } from '../app/layout/layout';
import { ProfileLayout } from '../app/layout/profile-layout';
import { usePathname } from '../hooks/use-pathname';

import '@fontsource/montserrat';
import '../styles/tailwind.css';

export default function App({ Component, pageProps }: AppProps<{ state: State }>) {
  const pathname = usePathname();
  const PageLayout = pathname.startsWith('/profil') ? ProfileLayout : Fragment;

  const page = <Component {...pageProps} />;

  return (
    <Layout preloadedState={pageProps.state}>
      <Head>
        <meta name="description" content="Échanges critiques" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>{page}</PageLayout>
    </Layout>
  );
}
