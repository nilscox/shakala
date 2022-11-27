import {
  render as renderTestingLibrary,
  renderHook as renderHookTestingLibrary,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line no-restricted-imports
import { Provider as ReduxProvider } from 'react-redux';
import { Store } from 'redux';

export type TestRenderer = ReturnType<typeof createTestRenderer>;

export const createTestRenderer = () => {
  let wrapper = ({ children }: { children: React.ReactNode }) => <>{children}</>;

  const wrap = <Props extends { children: React.ReactNode }>(
    Provider: React.ComponentType<Props>,
    props: Omit<Props, 'children'>,
  ) => {
    const W = wrapper;

    wrapper = ({ children }) => (
      <Provider {...(props as Props)}>
        <W>{children}</W>
      </Provider>
    );
  };

  const render = (ui: React.ReactElement) => {
    const user = userEvent.setup();

    renderTestingLibrary(ui, { wrapper });

    return user;
  };

  render.hook = <Props, Result>(hook: (initialProps: Props) => Result) => {
    return renderHookTestingLibrary(hook, { wrapper });
  };

  render.withStore = (store: Store) => {
    wrap(ReduxProvider, { store });
    return render;
  };

  return render;
};
