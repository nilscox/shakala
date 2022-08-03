import { array } from './array';

describe('array', () => {
  it('creates an array of elements', () => {
    expect(array(2, (i) => i)).toEqual([0, 1]);
  });
});
