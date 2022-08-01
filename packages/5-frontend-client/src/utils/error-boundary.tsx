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
          {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
          <p className="my-[4rem] text-xl">Une erreur s'est produite...</p>
          <pre className="overflow-x-auto p-2 w-full max-w-page bg-neutral rounded border">
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
