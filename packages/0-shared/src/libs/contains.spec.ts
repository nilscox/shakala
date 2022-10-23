import { contains } from './contains';

describe('contains', () => {
  it('returns true when an array contains a given element', () => {
    expect(contains([1, 2], 1)).toBe(true);
    expect(contains([1, 2], 2)).toBe(true);
  });

  it('returns false when an array does not contain a given element', () => {
    expect(contains([], 1)).toBe(false);
    expect(contains([1, 2], 3)).toBe(false);
  });

  it('returns false when an array does not contain a referentially equal element', () => {
    expect(contains([{}], {})).toBe(false);
  });
});
