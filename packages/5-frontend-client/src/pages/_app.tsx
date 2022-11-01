import { State } from 'frontend-domain';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Layout } from '../layout/layout';

import '@fontsource/montserrat';
import '../styles/tailwind.css';

export default function App({ Component, pageProps }: AppProps<{ state: State }>) {
  return (
    <Layout preloadedState={pageProps.state}>
      <Head>
        <meta name="description" content="Échanges critiques" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
