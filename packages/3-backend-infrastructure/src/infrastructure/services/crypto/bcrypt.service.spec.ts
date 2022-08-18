import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  const service = new BcryptService();

  // cspell:disable
  const input = 'hello';
  const hash = '$2b$10$MR2w5dYAUX0cF0uyxTlhj.rFB6BlponXxXgc7100k6joQzOuRNXCe';
  const invalidHash = '$2b$10$XjzrcuYS4o3N6r1nAItOhut2nfuKOPJIm4Pqvp9DzCjlwAXb3v6fi';
  // cspell:enable

  it('hashes a string', async () => {
    expect(await service.hash(input)).toEqual(expect.any(String));
  });

  it('compares a string', async () => {
    expect(await service.compare(input, hash)).toBe(true);
    expect(await service.compare('nope', hash)).toBe(false);
    expect(await service.compare(input, invalidHash)).toBe(false);
  });

  it('hash and compare', async () => {
    expect(await service.compare(input, await service.hash(input))).toBe(true);
  });
});
