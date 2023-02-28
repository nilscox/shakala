import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { array } from './array';

describe('[unit] array', () => {
  it('creates an array of elements', () => {
    expect(array(2, (i) => i)).toEqual([0, 1]);
  });
});
