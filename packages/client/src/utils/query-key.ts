import { AnyFunction } from '@shakala/shared';
import { Token } from 'brandi';

export type QueryParameters<Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter> = [
  adapterToken: Token<Adapter>,
  method: Method,
  ...params: Parameters<Adapter[Method]>
];

export type QueryKey<
  Adapter extends QueryAdapter<Method> = QueryAdapter<PropertyKey>,
  Method extends keyof Adapter = keyof Adapter
> = [string, Method, Parameters<Adapter[Method]>];

export type QueryAdapter<Method extends PropertyKey> = Record<Method, AnyFunction>;

export const getQueryKey = <Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  token: Token<Adapter>,
  method: Method,
  ...params: Parameters<Adapter[Method]>
): QueryKey<Adapter, Method> => {
  return [token.__d, method, params];
};
