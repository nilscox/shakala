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
          <p className="my-10 text-xl">Une erreur s'est produite...</p>
          <pre className="w-full max-w-page overflow-x-auto rounded border bg-neutral p-2">
            {this.renderError(error)}
          </pre>
        </Fallback>
      );
    }

    return children;
  }

  private renderError(error: unknown) {
    const { message, stack } = error as Record<string, string>;

    if (stack) {
      return stack;
    }

    if (message) {
      return message;
    }

    return JSON.stringify(error);
  }
}
