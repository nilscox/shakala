import { PaginationData } from 'backend-application/src/utils/pagination';
import { paginationQuerySchema } from 'shared';
import * as yup from 'yup';

import { BadRequest } from '../../http/http-errors';
import { Request } from '../../http/request';

type FieldValidationError = {
  /** invalid field name */
  field: string;

  /** invalid field value */
  value?: unknown;

  /** unique identifier of the error (e.g. minLength) */
  error: string;

  /** error description */
  messages?: string[];
};

export class ValidationError extends BadRequest {
  constructor(public readonly fields: FieldValidationError[]) {
    super('ValidationError', 'invalid input', { fields });
  }

  static from(fields: Record<string, string | [string, string]>) {
    return new ValidationError(
      Object.entries(fields).map(([field, err]) => {
        const [error, value] = err instanceof Array ? err : [err, undefined];

        return {
          field,
          error,
          value,
        };
      }),
    );
  }

  static fromYup(errors: yup.ValidationError) {
    return new ValidationError(
      errors.inner.map((error) => ({
        field: error.path as string,
        error: error.type as string,
        value: error.params?.['value'],
        messages: error.errors,
      })),
    );
  }
}

export class ValidationService {
  async query<Schema extends yup.AnySchema>(req: Request, schema: Schema) {
    try {
      return await schema.validate(Object.fromEntries(req.query ?? []), { abortEarly: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw ValidationError.fromYup(error);
      }

      throw error;
    }
  }

  async pagination(req: Request): Promise<PaginationData> {
    const result = await this.query(req, paginationQuerySchema);

    return {
      page: result.page ? Number(result.page) : undefined,
      pageSize: result.pageSize ? Number(result.pageSize) : undefined,
    };
  }

  async body<Schema extends yup.AnySchema>(req: Request, schema: Schema) {
    try {
      if (req.body === undefined) {
        throw new BadRequest('MissingBody', 'the request body is required');
      }

      return await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw ValidationError.fromYup(error);
      }

      throw error;
    }
  }
}
