import { wait } from './wait';

export const waitFor = async <T>(cb: () => Promise<T>): Promise<T> => {
  let error: unknown;
  const start = Date.now();

  do {
    try {
      return await cb();
    } catch (err) {
      error = err;
    }

    await wait(10);
  } while (error && Date.now() - start < 2000);

  throw error;
};
