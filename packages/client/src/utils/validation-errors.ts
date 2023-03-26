import { UseFormReturn } from 'react-hook-form';

import { HttpResponse } from '../adapters/http/http.port';

type ValidationErrorResponseBody = {
  code: 'ValidationError';
  fields: Array<{ type: string; path: string }>;
};

type FieldNameMapper = (fieldName: string) => string;

export class ValidationErrors {
  constructor(private readonly fieldErrors: Record<string, string>) {}

  static from(response: HttpResponse, mapFieldName: FieldNameMapper = (fieldName) => fieldName) {
    if (!this.isValidationErrorResponseBody(response.body)) {
      return;
    }

    const fieldErrors = response.body.fields.reduce(
      (obj, { type, path }) => ({
        ...obj,
        [mapFieldName(path)]: type,
      }),
      {} as Record<string, string>
    );

    return new ValidationErrors(fieldErrors);
  }

  setFormErrors(form: UseFormReturn<any>) {
    for (const [fieldName, message] of Object.entries(this.fieldErrors)) {
      form.setError(fieldName, { message });
    }
  }

  private static isValidationErrorResponseBody(body: unknown): body is ValidationErrorResponseBody {
    if (typeof body !== 'object' || body === null) {
      return false;
    }

    if (!('code' in body) || body.code !== 'ValidationError') {
      return false;
    }

    return true;
  }
}
