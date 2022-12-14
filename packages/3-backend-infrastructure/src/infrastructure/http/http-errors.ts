import { BaseError, HttpErrorBody } from 'shared';

import { Response } from './response';

export class HttpError
  extends BaseError<Record<string, unknown> | undefined>
  implements Response<HttpErrorBody>
{
  public readonly headers = new Map<string, string>();
  public readonly body: HttpErrorBody;

  protected constructor(
    public readonly status: number,
    code: string,
    message: string,
    public readonly details: Record<string, unknown> | undefined,
  ) {
    super(message);

    this.body = {
      code,
      message,
      details,
    };
  }
}

const createHttpError = (status: number) => {
  return class extends HttpError {
    constructor(code: string, message: string, details?: Record<string, unknown>) {
      super(status, code, message, details);
    }
  };
};

const createHttpErrorWithCode = (status: number, code: string) => {
  return class extends HttpError {
    constructor(message: string, details?: Record<string, unknown>) {
      super(status, code, message, details);
    }
  };
};

export const BadRequest = createHttpError(400);
export const Unauthorized = createHttpError(401);
export const Forbidden = createHttpError(403);
export const NotFound = createHttpErrorWithCode(404, 'NotFound');
export const InternalServerError = createHttpErrorWithCode(500, 'InternalServerError');
export const NotImplemented = createHttpErrorWithCode(501, 'NotImplemented');
