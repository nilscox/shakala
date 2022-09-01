import { Component } from 'react';
import { useLocation } from 'react-router-dom';
import { get } from 'shared';

import { AuthenticationModal } from '../domain/authentication/authentication-modal';
import { Fallback } from '../elements/fallback';

import { Footer } from './footer';
import { Header } from './header';
import { PageTitle } from './page-title';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();

  return (
    <>
      <PageTitle />
      <Header className="mx-auto max-w-page" />
      <main className="px-2 mx-auto max-w-page min-h-main sm:px-4">
        <ErrorBoundary pathname={pathname}>{children}</ErrorBoundary>
      </main>
      <Footer className="mx-auto max-w-page" />
      <AuthenticationModal />
    </>
  );
};

type ErrorBoundaryProps = {
  pathname: string;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error?: Error;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { pathname } = this.props;
    const { error } = this.state;

    if (error && prevProps.pathname !== pathname) {
      this.dismiss();
    }
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <Fallback>
          {this.renderError(error)}
          <small className="mt-1 font-normal">
            Veillez <button onClick={() => this.dismiss()}>réessayer</button> plus tard.
          </small>
        </Fallback>
      );
    }

    return this.props.children;
  }

  private renderError(error: unknown) {
    const name = get(error, 'name');

    if (name === 'NetworkError') {
      return this.renderNetworkError();
    }

    return <>Une erreur s'est produite</>;
  }

  private renderNetworkError() {
    if (!navigator.onLine) {
      return <>Il semblerait que vous ne soyez plus connecté(e) à internet...</>;
    }

    return <>Il semblerait que le serveur soit indisponible...</>;
  }

  private dismiss() {
    this.setState({ error: undefined });
  }
}
