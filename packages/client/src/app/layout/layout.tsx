import { PageTitle } from '../page-title';

import { Footer } from './footer';
import { Header } from './header';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <>
    <PageTitle />
    <Header className="mx-auto max-w-6" />
    <main className="mx-auto min-h-3 max-w-6 px-2 sm:px-4">{children}</main>
    <Footer className="mx-auto max-w-6" />
  </>
);
