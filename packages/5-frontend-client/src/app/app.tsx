import { SnackbarProvider } from '~/components/elements/snackbar';

import { Footer } from './footer';
import { Header } from './header';
import { PageTitle } from './page-title';

type AppProps = {
  children: React.ReactNode;
};

export const App = ({ children }: AppProps) => (
  <SnackbarProvider>
    <PageTitle />
    <Header className="mx-auto max-w-6" />
    <main className="mx-auto min-h-3 max-w-6 px-2 sm:px-4">{children}</main>
    <Footer className="mx-auto max-w-6" />
    {/* <AuthenticationModal /> */}
  </SnackbarProvider>
);
