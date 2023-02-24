import { Entity } from '../ddd/entity';
import { ValueObject } from '../ddd/value-object';

export type Factory<T, P = Partial<T>> = (overrides?: P) => T;

export type ValueObjectFactory<VO extends ValueObject> = VO extends ValueObject<infer V>
  ? Factory<VO, Partial<V>>
  : never;

export type EntityFactory<E extends Entity> = E extends Entity<infer P> ? Factory<E, Partial<P>> : never;
