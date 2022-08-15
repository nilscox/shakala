import { Query, QueryHandler } from 'backend-application';
import { ClassType } from 'shared';

export interface QueryBus {
  execute<T>(query: Query): T | Promise<T>;
}

export class RealQueryBus {
  private handlers = new Map<Query, QueryHandler<Query, unknown>>();

  register<Q extends Query>(query: ClassType<Q>, handler: QueryHandler<Q, unknown>): void {
    this.handlers.set(query, handler);
  }

  execute<T>(query: Query): T | Promise<T> {
    const ctor = query.constructor;
    const handler = this.handlers.get(ctor);

    if (!handler) {
      throw new Error('QueryBus: cannot find handler for ' + ctor.name);
    }

    return handler.handle(query) as T;
  }
}
