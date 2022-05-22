import { validate, ValidationError as ClassValidatorError } from 'class-validator';
import { injectable } from 'inversify';

export class ValidationError extends Error {
  constructor(private readonly errors: Record<string, string[]>) {
    super('ValidationError');
  }

  static formatted(errors: Record<string, string[]>) {
    return new ValidationError(errors).formatted;
  }

  get formatted() {
    return {
      error: this.message,
      ...this.errors,
    };
  }
}

@injectable()
export class ValidationService {
  async validate(dto: object) {
    const errors = await validate(dto);

    if (errors.length) {
      throw new ValidationError(this.transformClassValidatorErrors(errors));
    }
  }

  private transformClassValidatorErrors(inputErrors: ClassValidatorError[]) {
    const errors: Record<string, string[]> = {};

    for (const error of inputErrors) {
      errors[error.property] = [];

      for (const constraint of Object.keys(error.constraints ?? {})) {
        errors[error.property].push(constraint);
      }
    }

    return errors;
  }
}
