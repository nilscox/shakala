import * as yup from 'yup';

type FieldError = {
  value: string;
  error: string;
};

export class ValidationErrors {
  constructor(private fieldErrors: Record<string, FieldError>) {}

  private static validationErrorSchema = yup.object({
    code: yup.string().oneOf(['ValidationError']).required(),
    details: yup
      .object({
        fields: yup
          .array()
          .of(
            yup
              .object({
                field: yup.string().required(),
                error: yup.string().required(),
                value: yup.string(),
              })
              .required(),
          )
          .required(),
      })
      .required(),
  });

  static from(object: unknown): ValidationErrors | undefined {
    if (!object) {
      return;
    }

    const error = ValidationErrors.validationErrorSchema.validateSync(object);

    if (error) {
      return new ValidationErrors(
        error.details.fields.reduce(
          (obj, { field, error, value }) => ({
            ...obj,
            [field]: { error, value },
          }),
          {},
        ),
      );
    }
  }

  withFieldMapper(mapper: (field: string) => string | undefined) {
    for (const key of Object.keys(this.fieldErrors)) {
      const mappedKey = mapper(key);
      if (!mappedKey) {
        continue;
      }

      this.fieldErrors[mappedKey] = this.fieldErrors[key];
      delete this.fieldErrors[key];
    }

    return this;
  }

  getFields(): string[] {
    return Object.keys(this.fieldErrors);
  }

  getFieldError(field: string): string | undefined {
    return this.fieldErrors[field]?.error;
  }
}
