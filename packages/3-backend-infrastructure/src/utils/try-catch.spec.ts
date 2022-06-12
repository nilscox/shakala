import { tryCatch } from './try-catch';

class ErrorA extends Error {}
class ErrorB extends Error {}

describe('tryCatch', () => {
  const execute = (...args: Parameters<typeof tryCatch>) => {
    return tryCatch(...args)
      .catch(ErrorA, (error) => ({ a: error.message }))
      .catch(ErrorB, (error) => ({ b: error.message }))
      .run();
  };

  it('returns the value', async () => {
    expect(await execute(() => 42)).toEqual(42);
    expect(await execute(async () => 51)).toEqual(51);
  });

  it('catches the error, transform and rethrow it', async () => {
    await expect(
      execute(() => {
        throw new ErrorA('a');
      }),
    ).rejects.test((err) => expect(err).toEqual({ a: 'a' }));

    await expect(
      execute(async () => {
        throw new ErrorB('b');
      }),
    ).rejects.test((err) => expect(err).toEqual({ b: 'b' }));
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
