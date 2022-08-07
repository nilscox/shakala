import { PrimaryKey, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

export abstract class BaseSqlEntity<DomainEntity> {
  @PrimaryKey()
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  abstract assignFromDomain(em: EntityManager, entity: DomainEntity, ...args: unknown[]): void;
  abstract toDomain(...args: unknown[]): DomainEntity;
}
