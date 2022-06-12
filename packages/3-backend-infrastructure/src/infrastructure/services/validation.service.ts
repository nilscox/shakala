import * as yup from 'yup';

import { BadRequest } from '../http/http-errors';
import { Request } from '../http/request';

type FieldValidationError = {
  field: string;
  error: string;
  value?: unknown;
  messages?: string[];
};

export class ValidationError extends BadRequest {
  constructor(public readonly fields: FieldValidationError[]) {
    super('invalid input', { fields });

    this.body.error = 'ValidationError';
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

  async body<Schema extends yup.AnySchema>(req: Request, schema: Schema) {
    try {
      if (req.body === undefined) {
        throw new BadRequest('missing body');
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
