import { BaseError } from 'shared';

export const SerializeErrorError = BaseError.extend('cannot serialize error', (error) => ({ error }));

export type SerializedError = {
  name: string;
  message: string;
  stack?: string;
};

export const serializeError = (error: unknown): SerializedError => {
  if (error instanceof Error) {
    return {
      name: error.constructor.name,
      message: error.message,
      stack: error.stack,
    };
  }

  throw new SerializeErrorError(error);
};
