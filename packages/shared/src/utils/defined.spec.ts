import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { defined } from './defined';

describe('defined', () => {
  it('returns the value when its not undefined', () => {
    expect(defined(42)).toBe(42);
  });

  it('keeps the same reference', () => {
    const obj = {};

    expect(defined(obj)).toBe(obj);
  });

  it('throws an AssertionError when the value is not defined', () => {
    expect(() => defined(undefined)).toThrow(new Error('Assertion failed'));
    expect(() => defined(null)).toThrow(new Error('Assertion failed'));
  });

  it('throws an AssertionError with a custom message', () => {
    expect(() => defined(undefined, 'message')).toThrow(new Error('message'));
  });
});
