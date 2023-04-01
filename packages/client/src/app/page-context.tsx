import { assert } from '@shakala/shared';
import { createContext, useContext } from 'react';

import { PageContext } from '~/renderer/page-context';

const pageContext = createContext<PageContext>(null as never);

export const PageContextProvider = pageContext.Provider;

export const usePageContext = () => {
  const context = useContext(pageContext);

  assert(context);

  return context;
};
