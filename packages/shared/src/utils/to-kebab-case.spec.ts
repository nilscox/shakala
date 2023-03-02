import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { toKebabCase } from './to-kebab-case';

describe('toKebabCase', () => {
  it('returns an empty string for an empty string', () => {
    expect(toKebabCase('')).toEqual('');
  });

  it('returns the same string for a lower case wore', () => {
    expect(toKebabCase('lowercase')).toEqual('lowercase');
  });

  it('transforms upper case letters', () => {
    expect(toKebabCase('lowerCase')).toEqual('lower-case');
  });

  it('transforms multiple upper case letters', () => {
    expect(toKebabCase('multipleUpperCase')).toEqual('multiple-upper-case');
  });

  it('does not happen a - before first letter', () => {
    expect(toKebabCase('MultipleUpperCase')).toEqual('multiple-upper-case');
  });
});
