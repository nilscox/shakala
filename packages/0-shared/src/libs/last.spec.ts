import { last } from './last';

describe('last', () => {
  it("returns an array's last element", () => {
    expect(last([1, 2])).toEqual(2);
  });

  it('returns undefined when the array is empty', () => {
    expect(last([])).toBe(undefined);
  });
});
