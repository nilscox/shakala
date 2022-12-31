import { ValidationErrors } from '@shakala/frontend-domain';
import { BaseError, HttpErrorBody, parseError } from '@shakala/shared';
import * as yup from 'yup';

import { FetchHttpGateway } from './fetch-http.gateway';
import { HttpError, QueryParams, Response, WriteRequestOptions } from './http.gateway';

const httpErrorSchema = yup.object({
  code: yup.string().required(),
  message: yup.string().required(),
  details: yup.object().optional(),
});

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
    };
  }

  protected override getError(response: Response<unknown>): BaseError<unknown> | HttpError {
    const errorBody = this.parseErrorBody(response.body);

    if (!errorBody) {
      return super.getError(response);
    }

    if (errorBody?.code === 'ValidationError') {
      throw ValidationErrors.from(errorBody);
    }

    return parseError(response.body) ?? super.getError(response);
  }

  private parseErrorBody(body: unknown): HttpErrorBody | undefined {
    try {
      return httpErrorSchema.validateSync(body);
    } catch (error) {
      return undefined;
    }
  }
}
