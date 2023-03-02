export interface Repository<Item> {
  findById(id: string): Promise<Item | undefined>;
  findByIdOrFail(id: string): Promise<Item>;
  save(item: Item): Promise<void>;
  delete(item: Item): Promise<void>;
}
