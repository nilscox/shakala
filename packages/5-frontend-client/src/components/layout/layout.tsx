import { AuthenticationModal } from '../domain/authentication/authentication-modal';

import { Footer } from './footer';
import { Header } from './header';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <>
    <Header className="mx-auto max-w-page" />
    <main className="px-2 mx-auto max-w-page min-h-main sm:px-4">{children}</main>
    <Footer className="mx-auto max-w-page" />
    <AuthenticationModal />
  </>
);
