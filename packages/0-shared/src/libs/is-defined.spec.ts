import { isDefined } from './is-defined';

describe('isDefined', () => {
  it('returns true when the value is defined', () => {
    expect(isDefined(42)).toBe(true);
  });

  it('returns false when the value is not defined', () => {
    expect(isDefined(undefined)).toBe(false);
  });
});
