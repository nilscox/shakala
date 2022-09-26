import { BcryptAdapter } from './bcrypt.adapter';

describe('BcryptAdapter', () => {
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
    expect(await crypto.compare(input, hash)).toBe(true);
    expect(await crypto.compare('nope', hash)).toBe(false);
    expect(await crypto.compare(input, invalidHash)).toBe(false);
  });

  it('hash and compare', async () => {
    expect(await crypto.compare(input, await crypto.hash(input))).toBe(true);
  });
});
