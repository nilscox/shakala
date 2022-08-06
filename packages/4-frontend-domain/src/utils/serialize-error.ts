import { PayloadError } from 'shared';

type SerializedError = {
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

  throw new PayloadError('cannot serialize error', { error });
};
