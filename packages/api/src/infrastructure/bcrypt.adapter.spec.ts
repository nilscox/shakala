import { expect } from '@shakala/common';
import { describe, it } from 'vitest';

import { BcryptAdapter } from './bcrypt.adapter';

describe('[intg] BcryptAdapter', function () {
  const crypto = new BcryptAdapter();

  // cspell:disable
  const input = 'hello';
  const hash = '$2b$10$MR2w5dYAUX0cF0uyxTlhj.rFB6BlponXxXgc7100k6joQzOuRNXCe';
  const invalidHash = '$2b$10$XjzrcuYS4o3N6r1nAItOhut2nfuKOPJIm4Pqvp9DzCjlwAXb3v6fi';
  // cspell:enable

  it('hashes a string', async () => {
    expect(await crypto.hash(input)).toEqual(expect.any(String));
  });

  it('compares a string', async () => {
    expect(await crypto.compare(hash, input)).toBe(true);
    expect(await crypto.compare(hash, 'nope')).toBe(false);
    expect(await crypto.compare(invalidHash, input)).toBe(false);
  });

  it('hash and compare', async () => {
    expect(await crypto.compare(await crypto.hash(input), input)).toBe(true);
  });
});
