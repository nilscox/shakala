import clone from 'lodash.clonedeep';

import { Repository } from '../interfaces';

export class InMemoryRepository<Item extends { id: string }> implements Repository<Item> {
  private items: Map<string, Item>;

  constructor(private _items: Item[] = []) {
    this.items = new Map(_items.map((item) => [item.id, item]));

    if (typeof beforeEach !== 'undefined') {
      beforeEach(() => {
        this.clear();
      });
    }
  }

  async findAll(): Promise<Item[]> {
    return this.all();
  }

  async findById(id: string): Promise<Item | undefined> {
    return this.get(id);
  }

  async findByIdOrFail(id: string): Promise<Item> {
    const item = this.get(id);

    if (!item) {
      throw new Error(`${this.constructor.name}: Item not found, id = "${id}"`);
    }

    return item;
  }

  async save(item: Item): Promise<void> {
    this.add(item);

    const idx = this._items.findIndex(({ id }) => id === item.id);

    if (idx < 0) {
      this._items.push(item);
    } else {
      this._items[idx] = item;
    }
  }

  async delete(item: Item): Promise<void> {
    this.items.delete(item.id);

    const idx = this._items.findIndex(({ id }) => id === item.id);

    if (idx >= 0) {
      this._items.splice(idx, 1);
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

  add(item: Item) {
    return clone(this.items.set(item.id, clone(item)));
  }

  find(predicate: (item: Item) => boolean) {
    return this.all().find(predicate);
  }

  filter(predicate: (item: Item) => boolean) {
    return this.all().filter(predicate);
  }
}
