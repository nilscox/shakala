import { State } from 'frontend-domain';

import { AuthenticationModal } from '~/app/authentication/authentication-modal';
import { PageTitle } from '~/app/page-title/page-title';
import { ReduxProvider } from '~/utils/redux-provider';

import { Footer } from './footer';
import { Header } from './header';

type LayoutProps = {
  preloadedState: State;
  children: React.ReactNode;
};

export const Layout = ({ preloadedState, children }: LayoutProps) => (
  <ReduxProvider preloadedState={preloadedState}>
    <PageTitle />
    <AuthenticationModal />
    <Header className="mx-auto max-w-6" />
    <main className="mx-auto min-h-3 max-w-6 px-2 sm:px-4">{children}</main>
    <Footer className="mx-auto max-w-6" />
  </ReduxProvider>
);
