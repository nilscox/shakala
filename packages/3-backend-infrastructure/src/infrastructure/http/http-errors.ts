import { Response } from './response';

type ErrorBody = {
  error: string;
  message?: string;
  [key: string]: unknown;
};

export class HttpError extends Error implements Response<ErrorBody> {
  public readonly headers = new Map<string, string>();
  public readonly body: ErrorBody;

  protected constructor(
    public readonly status: number,
    error: string,
    message?: string,
    details?: Record<string, unknown>,
  ) {
    super(`${error}${message ? ` (${message})` : ''}\n${JSON.stringify(details, null, 2)}`);
    this.body = { error, message, details };
  }
}

const createHttpError = (status: number, error: string) => {
  return class extends HttpError {
    constructor(message?: string, details?: Record<string, unknown>) {
      super(status, error, message, details);
    }
  };
};

export const BadRequest = createHttpError(400, 'BadRequest');
export const Forbidden = createHttpError(401, 'Forbidden');
export const NotFound = createHttpError(404, 'NotFound');
export const NotImplemented = createHttpError(501, 'NotImplemented');
