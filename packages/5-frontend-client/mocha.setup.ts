import '@nilscox/expect-dom';
import { RootHookObject } from 'mocha';

export const mochaHooks: RootHookObject = {
  beforeAll() {
    window.scroll = () => {};

    global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
    global.cancelAnimationFrame = clearTimeout;
  },
};
