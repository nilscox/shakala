import { Query } from 'backend-application';

import { QueryBus } from '../infrastructure';

export class MockQueryBus implements QueryBus {
  private map = new Map<Query, unknown>();
  private executed: Query[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for(query: { new (...args: any[]): Query }) {
    return {
      return: (result: unknown) => {
        this.map.set(query, result);
      },
    };
  }

  get lastQuery() {
    return this.executed[this.executed.length - 1];
  }

  execute = <Result>(query: Query) => {
    const ctor = query.constructor;

    if (!this.map.has(ctor)) {
      throw new Error(`MockQueryBus: no result for command ${ctor.name}`);
    }

    this.executed.push(query);

    return this.map.get(ctor) as Result;
  };
}
