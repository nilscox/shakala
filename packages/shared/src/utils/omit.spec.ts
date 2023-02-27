import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { omit } from './omit';

describe('omit', () => {
  it('returns an object without a given set of keys', () => {
    expect(omit({ one: 1, two: 2 }, 'one')).toEqual({ two: 2 });
  });
});
