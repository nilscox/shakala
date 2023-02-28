import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { last } from './last';

describe('[unit] last', () => {
  it("returns an array's last element", () => {
    expect(last([1, 2])).toEqual(2);
  });

  it('returns undefined when the array is empty', () => {
    expect(last([])).toBeUndefined();
  });
});
