import { ClassType } from 'shared';

import { ExecutionContext } from '../utils';

export interface Authorizer {
  authorize(ctx: ExecutionContext): void | Promise<void>;
}

export const Authorize = (...authorizers: ClassType<Authorizer>[]): ClassDecorator => {
  return (UseCase) => {
    Reflect.set(UseCase, 'authorizers', authorizers);
  };
};
