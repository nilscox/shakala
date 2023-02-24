import clone from 'lodash.clonedeep';

import { Entity } from '../ddd/entity';

export abstract class InMemoryRepository<Item extends Entity<unknown>> {
  private items: Map<string, Item>;

  constructor(items: Item[] = []) {
    this.items = new Map(items.map((item) => [item.identifier, item]));
  }

  async save(item: Item): Promise<void> {
    this.add(item);
  }

  clear() {
    this.items.clear();
  }

  all() {
    return Array.from(this.items.values()).map(clone);
  }

  get(identifier: string) {
    return clone(this.items.get(identifier));
  }

  add(item: Item) {
    return clone(this.items.set(item.identifier, clone(item)));
  }

  find(predicate: (item: Item) => boolean) {
    return this.all().find(predicate);
  }

  filter(predicate: (item: Item) => boolean) {
    return this.all().filter(predicate);
  }
}
