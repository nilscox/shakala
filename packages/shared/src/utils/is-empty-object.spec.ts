import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { isEmptyObject } from './is-empty-object';

describe('isEmptyObject', () => {
  it('returns true when the object has no key', () => {
    expect(isEmptyObject({})).toBe(true);
  });

  it('returns false when the object has some keys', () => {
    expect(isEmptyObject({ some: 'keys' })).toBe(false);
  });
});
