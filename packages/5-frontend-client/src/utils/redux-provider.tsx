import { createStore, Dependencies } from 'frontend-domain';
import { ReactNode, useMemo } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Provider } from 'react-redux';

type ReduxProviderProps = {
  dependencies: Dependencies;
  children: ReactNode;
};

export const ReduxProvider = ({ dependencies, children }: ReduxProviderProps) => {
  const store = useMemo(() => createStore(dependencies), [dependencies]);

  return <Provider store={store}>{children}</Provider>;
};
