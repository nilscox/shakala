import { get } from './get';

describe('get', () => {
  it('returns the input when no path is provided', () => {
    expect(get(51)).toEqual(51);
  });

  it("retrieves the object's value for a specific key", () => {
    expect(get({ value: 51 }, 'value')).toEqual(51);
  });

  it("retrieves the object's nested value for a specific path", () => {
    expect(get({ nested: { value: 51 } }, 'nested', 'value')).toEqual(51);
  });

  it('returns undefined when the path does not match the object', () => {
    expect(get(undefined, 'value')).toBeUndefined();
    expect(get({ nested: 51 }, 'nested', 'value')).toBeUndefined();
    expect(get({ nested: { nope: 51 } }, 'nested', 'value')).toBeUndefined();
    expect(get({ nope: { value: 51 } }, 'nested', 'value')).toBeUndefined();
  });
});
