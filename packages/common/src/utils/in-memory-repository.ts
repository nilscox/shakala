import util from 'node:util';

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
      throw new EntityNotFoundError(this.entity.name, { id });
    }

    return item;
  }

  async save(item: Item): Promise<void> {
    this.add(item);
  }

  async delete(item: Item): Promise<void> {
    this.items.delete(item.id);
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

  [util.inspect.custom]() {
    const formatItem = (item: Item) => util.inspect(item, { breakLength: 80, colors: true, depth: null });
    const items = this.all().map(formatItem).join('\n').split('\n').join('\n  ');

    return `InMemoryRepository<${this.entity.name}> {\n  ${items}\n}`;
  }
}
