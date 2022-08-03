export interface Repository<Entity> {
  findAll(): Promise<Entity[]>;
  findById(entityId: string): Promise<Entity | undefined>;
  findByIdOrFail(entityId: string): Promise<Entity>;
  save(entity: Entity): Promise<void>;
  delete(entity: Entity): Promise<void>;
}
