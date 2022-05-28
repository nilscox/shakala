import { injectable } from 'inversify';
import clone from 'lodash.clonedeep';

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
    return this.get(id);
  }

  async save(item: Item): Promise<void> {
    this.set(item);

    const idx = this._items.findIndex(({ id }) => id === item.id);

    if (idx < 0) {
      this._items.push(item);
    } else {
      this._items[idx] = item;
    }
  }

  clear() {
    this.items.clear();
  }

  all() {
    return Array.from(this.items.values()).map(clone);
  }

  get(id: string) {
    return clone(this.items.get(id));
  }

  set(item: Item) {
    return clone(this.items.set(item.id, clone(item)));
  }

  find(predicate: (item: Item) => boolean) {
    return this.all().find(predicate);
  }

  filter(predicate: (item: Item) => boolean) {
    return this.all().filter(predicate);
  }
}
