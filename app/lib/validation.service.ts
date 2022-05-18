import { validate, ValidationError as ClassValidatorValidationError } from 'class-validator';
import { injectable } from 'inversify';

export class ValidationError extends Error {
  constructor(private readonly errors: ClassValidatorValidationError[]) {
    super('ValidationError');
  }

  get formatted() {
    const errors: Record<string, string[]> = {};

    for (const error of this.errors) {
      errors[error.property] = [];

      for (const constraint of Object.keys(error.constraints ?? {})) {
        errors[error.property].push(constraint);
      }
    }

    return {
      error: this.message,
      ...errors,
    };
  }
}

@injectable()
export class ValidationService {
  async validate(dto: object) {
    const errors = await validate(dto);

    if (errors.length) {
      throw new ValidationError(errors);
    }
  }
}
