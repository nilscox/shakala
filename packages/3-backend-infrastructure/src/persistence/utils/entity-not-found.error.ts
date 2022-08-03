export class EntityNotFoundError extends Error {
  constructor(entityName: string) {
    super(`${entityName} not found`);
  }
}
