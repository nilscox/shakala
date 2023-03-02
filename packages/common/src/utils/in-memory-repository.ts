import { ClassType } from '@shakala/shared';
import clone from 'lodash.clonedeep';

import { Entity } from '../ddd/entity';

import { EntityNotFoundError } from './entity-not-found-error';

export abstract class InMemoryRepository<Item extends Entity> {
  private items: Map<string, Item>;

  abstract readonly entity: ClassType<Item>;

  constructor(items: Item[] = []) {
    this.items = new Map(items.map((item) => [item.id, item]));
  }

  async findById(id: string): Promise<Item | undefined> {
    return this.find((item) => item.id === id);
  }

  async findByIdOrFail(id: string): Promise<Item> {
    const item = await this.findById(id);

    if (!item) {
      throw new EntityNotFoundError(this.entity.name);
    }

    return item;
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
    return clone(this.items.set(item.id, clone(item)));
  }

  find(predicate: (item: Item) => boolean) {
    return this.all().find(predicate);
  }

  filter(predicate: (item: Item) => boolean) {
    return this.all().filter(predicate);
  }
}