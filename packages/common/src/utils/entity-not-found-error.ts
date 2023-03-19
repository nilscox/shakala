import { BaseError } from './base-error';

type Where = Record<string, unknown>;

export class EntityNotFoundError extends BaseError<{ entity: string; where?: Where }> {
  status = 404;

  constructor(entity: string, where?: Where) {
    super(`${entity} not found`, { entity, where });
  }
}
