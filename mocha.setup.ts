import expect from '@nilscox/expect';
import '@nilscox/expect-sinon';
import { RootHookObject } from 'mocha';
import Sinon from 'sinon';

process.env.TZ = 'UTC';
Error.stackTraceLimit = Infinity;

export const mochaHooks: RootHookObject = {
  beforeAll() {
    globalThis.expect = expect;

    if (process.argv?.includes('--watch') || process.argv?.includes('-w')) {
      console.log('\x1Bc');
    }
  },

  afterEach() {
    Sinon.restore();
  },
};
