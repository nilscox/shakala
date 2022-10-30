import { Montserrat } from '@next/font/google';
import { setUser } from 'frontend-domain';
import { headers } from 'next/headers';

import { api } from '../adapters';

import { App } from './app';
import { Dispatch } from './dispatch';
import { ReduxProvider } from './redux-provider';

import './global.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'auto',
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const { authenticationGateway } = api(headers().get('Cookie'));
  const user = await authenticationGateway.fetchUser();

  return (
    <html lang="en" className={montserrat.className}>
      <head>
        <meta name="description" content="Échanges critiques" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ReduxProvider>
          <Dispatch action={user ? setUser(user) : undefined}>
            <App>{children}</App>
          </Dispatch>
        </ReduxProvider>
      </body>
    </html>
  );
}
