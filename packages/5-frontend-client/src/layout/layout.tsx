import { State } from 'frontend-domain';

import { AuthenticationModal } from '../components/domain/authentication/authentication-modal';
import { ReduxProvider } from '../utils/redux-provider';

import { Footer } from './footer';
import { Header } from './header';
import { PageTitle } from './page-title';

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
