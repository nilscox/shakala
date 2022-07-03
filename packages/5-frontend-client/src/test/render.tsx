import { render } from '@testing-library/react';
import { TestStore } from 'frontend-domain';
import { History, createMemoryHistory } from 'history';
import { ReactNode } from 'react';
import { Router } from 'react-router-dom';

import { ReduxProvider } from '~/utils/redux-provider';

export class TestRenderer {
  private history: History | undefined;
  private store: TestStore | undefined;

  render(ui: React.ReactElement) {
    return render(ui, { wrapper: this.wrapper });
  }

  withMemoryRouter(history = createMemoryHistory()) {
    this.history = history;
    return this;
  }

  withRedux(store: TestStore) {
    this.store = store;
    return this;
  }

  private wrapper = ({ children }: { children: ReactNode }) => {
    let result = <>{children}</>;

    if (this.history) {
      result = (
        <Router location={this.history.location} navigator={this.history}>
          {result}
        </Router>
      );
    }

    if (this.store) {
      result = <ReduxProvider store={this.store.getReduxStore()}>{result}</ReduxProvider>;
    }

    return result;
  };
}
