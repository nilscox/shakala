import * as yup from 'yup';

import { HttpRequest, HttpResponse } from './http.port';

export class HttpError extends Error {
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;

  constructor(public readonly request: HttpRequest, public readonly response: HttpResponse) {
    super(`HTTP ${response.status} Error`);

    const { body } = this.response;

    if (HttpError.isApplicationErrorBody(body)) {
      this.code = body.code;
      this.message = body.message;
      this.details = body.details;
    }
  }

  get status() {
    return this.response.status;
  }

  private static errorResponseBodySchema = yup.object({
    code: yup.string().required(),
    message: yup.string().required(),
    details: yup.object(),
  });

  private static isApplicationErrorBody(
    body: unknown
  ): body is yup.InferType<typeof this.errorResponseBodySchema> {
    try {
      this.errorResponseBodySchema.validateSync(body);
      return true;
    } catch {
      return false;
    }
  }
}
