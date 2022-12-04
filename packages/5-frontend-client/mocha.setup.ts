import { RootHookObject } from 'mocha';

import '@nilscox/expect-dom';

export const mochaHooks: RootHookObject = {
  beforeAll() {
    window.scroll = () => {};
  },
};
