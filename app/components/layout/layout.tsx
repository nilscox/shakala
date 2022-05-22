import { User } from '~/types';
import { UserProvider } from '~/user.provider';

import { AuthenticationModal } from '../domain/authentication/authentication-modal';

import { Footer } from './footer';
import { Header } from './header';

type LayoutProps = {
  user?: User;
  children: React.ReactNode;
};

export const Layout = ({ user, children }: LayoutProps) => (
  <UserProvider value={user}>
    <Header className="mx-auto max-w-page" />
    <main className="px-2 mx-auto max-w-page min-h-big xs:px-3 md:px-4 md:min-h-page">{children}</main>
    <Footer className="mx-auto max-w-page" />
    <AuthenticationModal />
  </UserProvider>
);
