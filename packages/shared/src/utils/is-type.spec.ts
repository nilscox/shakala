import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { isType } from './is-type';

describe('isType', () => {
  it('returns the value when it matches the given type', () => {
    expect(isType('number', 42)).toEqual(42);
    expect(isType('string', 'hello')).toEqual('hello');
  });

  it('returns undefined when the value does not match the given type', () => {
    expect(isType('number', 'hello')).toBeUndefined();
    expect(isType('string', Symbol())).toBeUndefined();
  });
});
