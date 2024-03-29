import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { first } from './first';

describe('[unit] first', () => {
  it("returns an array's first element", () => {
    expect(first([1, 2])).toEqual(1);
  });

  it('returns undefined when the array is empty', () => {
    expect(first([])).toBeUndefined();
  });
});
