import { AuthorizationError, ValidationErrors } from 'frontend-domain';
import { HttpErrorBody } from 'shared';
import * as yup from 'yup';

import { FetchHttpGateway } from './fetch-http.gateway';
import {
  HttpError, QueryParams, Response, WriteRequestOptions
} from './http.gateway';

const httpErrorSchema = yup.object({
  code: yup.string().required(),
  message: yup.string().required(),
  details: yup.object().optional(),
});

export class ApiHttpError extends HttpError<HttpErrorBody> {
  constructor(response: Response<HttpErrorBody>) {
    super(response)
    this.message = this.body.message
  }

  get code() {
    return this.body.code;
  }

  get details() {
    return this.body.details;
  }

  static is(error: unknown, code?: string): error is ApiHttpError {
    if (!(error instanceof ApiHttpError)) {
      return false;
    }

    if (code === undefined) {
      return true;
    }

    return error.code === code;
  }
}

export class ApiFetchHttpGateway extends FetchHttpGateway {
  protected override getRequestInit<RequestBody, ResponseBody, Query extends QueryParams>(
    method: string,
    options: WriteRequestOptions<RequestBody, ResponseBody, Query>,
  ): RequestInit {
    const init = super.getRequestInit(method, options);

    return {
      ...init,
      credentials: 'include',
      cache: 'no-store',
    }
  }

  protected override getError(response: Response<unknown>): HttpError {
    const errorBody = this.parseErrorBody(response.body);

    if (!errorBody) {
      return super.getError(response);
    }

    if (errorBody?.code === 'Unauthorized') {
      throw AuthorizationError.from(errorBody);
    }

    if (errorBody?.code === 'ValidationError') {
      throw ValidationErrors.from(errorBody);
    }

    return new ApiHttpError(response as Response<HttpErrorBody>);
  }

  private parseErrorBody(body: unknown): HttpErrorBody | undefined {
    try {
      return httpErrorSchema.validateSync(body);
    } catch (error) {
      return undefined;
    }
  }

}
