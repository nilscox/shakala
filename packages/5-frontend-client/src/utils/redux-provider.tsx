import { Store } from 'frontend-domain';
import { ReactNode } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Provider } from 'react-redux';

type ReduxProviderProps = {
  store: Store;
  children: ReactNode;
};

export const ReduxProvider = ({ store, children }: ReduxProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};
