import { render, renderHook } from '@testing-library/react';
import { TestStore } from 'frontend-domain';
import { History, createMemoryHistory } from 'history';
import { ReactNode } from 'react';
import ReactModal from 'react-modal';
import { Router } from 'react-router-dom';

import { ReduxProvider } from '~/utils/redux-provider';

export { screen } from '@testing-library/dom';

export class TestRenderer {
  private history: History | undefined;
  private store: TestStore | undefined;

  constructor() {
    ReactModal.setAppElement('body');
  }

  render = (ui: React.ReactElement) => {
    return render(ui, { wrapper: this.wrapper });
  };

  renderHook = (param: Parameters<typeof renderHook>[0]) => {
    return renderHook(param, { wrapper: this.wrapper });
  };

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
