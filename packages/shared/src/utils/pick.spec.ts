import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { pick } from './pick';

describe('pick', () => {
  it('takes a subset of an object', () => {
    const value = pick({ one: 1, two: 2, three: 3 }, 'one', 'three');

    expect(value).toEqual({ one: 1, three: 3 });
  });
});
