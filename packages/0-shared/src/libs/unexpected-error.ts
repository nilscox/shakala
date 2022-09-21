import { BaseError } from './base-error';

export const UnexpectedError = BaseError.extend(
  'unexpected error',
  (error: string, details?: Record<string, unknown>) => ({
    error,
    ...details,
  }),
);
