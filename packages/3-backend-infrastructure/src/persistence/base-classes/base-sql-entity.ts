import { PrimaryKey, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { DomainDependencies } from 'backend-domain';

export abstract class BaseSqlEntity<DomainEntity> {
  @PrimaryKey()
  id!: string;

  @Property({ columnType: 'timestamp' })
  createdAt: Date = new Date();

  @Property({ columnType: 'timestamp', onUpdate: () => new Date() })
  updatedAt = new Date();

  abstract assignFromDomain(em: EntityManager, entity: DomainEntity, ...args: unknown[]): void;
  abstract toDomain(deps: DomainDependencies, ...args: unknown[]): DomainEntity;
}
