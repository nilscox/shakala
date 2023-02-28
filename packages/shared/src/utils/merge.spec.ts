import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { merge } from './merge';

describe('[unit] merge', () => {
  it('merges two objects', () => {
    expect(merge({}, {})).toEqual({});
    expect(merge({ foo: 'bar' }, {})).toEqual({ foo: 'bar' });
    expect(merge({ foo: 'bar' }, { foo: 'baz' })).toEqual({ foo: 'baz' });
  });

  it('merges two objects recursively', () => {
    expect(merge({ foo: { bar: 42 } }, { foo: { bar: 51 } })).toEqual({ foo: { bar: 51 } });
  });
});
