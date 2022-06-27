import { Component } from 'react';

import { Fallback } from '~/components/elements/fallback';

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
      return (
        <Fallback>
          <p className="my-4">Une erreur s'est produite...</p>
          <pre className="p-2 w-full max-w-modal rounded border">{JSON.stringify(error, null, 2)}</pre>
        </Fallback>
      );
    }

    return children;
  }
}
