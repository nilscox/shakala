import { tryCatch } from './try-catch';

class ErrorA extends Error {}
class ErrorB extends Error {}

describe('tryCatch', () => {
  const execute = (...args: Parameters<typeof tryCatch>) => {
    return tryCatch(...args)
      .catch(ErrorA, (error) => ({ a: error.message }))
      .catch(ErrorB, (error) => ({ b: error.message }))
      .value();
  };

  it('returns the value', async () => {
    expect(await execute(() => 42)).toEqual(42);
    expect(await execute(async () => 51)).toEqual(51);
  });

  it('catches and handles the error', async () => {
    expect(
      await execute(() => {
        throw new ErrorA('a');
      }),
    ).toEqual({ a: 'a' });

    expect(
      await execute(async () => {
        throw new ErrorB('b');
      }),
    ).toEqual({ b: 'b' });
  });

  it('throws when no handler matches', async () => {
    const error = new Error('nope');

    await expect(
      execute(async () => {
        throw error;
      }),
    ).rejects.toThrow(error);
  });
});
