import { Component } from 'react';

import Bug from '~/images/bug.svg';

import { PageTitle } from '../app/page-title';
import { Link } from '../elements/link';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error?: unknown;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: undefined,
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      return <ErrorView error={error} />;
    }

    return children;
  }
}

type ErrorViewProps = {
  error: unknown;
};

export const ErrorView = ({ error }: ErrorViewProps) => (
  <div className="col my-12 gap-4 text-center">
    <PageTitle>Erreur</PageTitle>

    <div className="text-xl">Une erreur qui ne devrait pas arriver... est arrivée quand même x(</div>

    <code>{getErrorMessage(error)}</code>

    <Link href="/">
      <Bug className="m-auto my-6 max-w-1 rounded-lg" />
    </Link>

    <div className="text-center text-xs text-muted">Pour m'excuser, voilà une image sympa.</div>
  </div>
);

const getErrorMessage = (error: unknown) => {
  const { message } = error as Error;

  if (typeof message === 'string') {
    return message;
  }

  return 'unknown error';
};
