export interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(itemId: string): Promise<T | undefined>;
  findByIdOrFail(itemId: string): Promise<T>;
  save(item: T): Promise<void>;
  delete(item: T): Promise<void>;
}
