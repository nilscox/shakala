import { injectable } from 'inversify';

@injectable()
export class InMemoryRepository<Item extends { id: string }> {
  private items: Map<string, Item>;

  constructor(private _items: Item[] = []) {
    this.items = new Map(_items.map((item) => [item.id, item]));
  }

  async findAll(): Promise<Item[]> {
    return this.all();
  }

  async findById(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async save(item: Item): Promise<void> {
    this.items.set(item.id, item);

    const idx = this._items.findIndex(({ id }) => id === item.id);

    if (idx < 0) {
      this._items.push(item);
    } else {
      this._items[idx] = item;
    }
  }

  protected all() {
    return Array.from(this.items.values());
  }

  protected get(id: string) {
    return this.items.get(id);
  }

  protected find(predicate: (item: Item) => boolean) {
    return this.all().find(predicate);
  }

  protected filter(predicate: (item: Item) => boolean) {
    return this.all().filter(predicate);
  }
}
