import { FilterQuery, Primary } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Repository } from 'backend-application';
import { DomainDependencies } from 'backend-domain';
import { BaseError, ClassType } from 'shared';

import { BaseSqlEntity } from './base-sql-entity';

export abstract class BaseSqlRepository<
  SqlEntity extends BaseSqlEntity<DomainEntity>,
  DomainEntity extends { id: string },
> implements Repository<DomainEntity>
{
  protected repository: EntityRepository<SqlEntity>;

  constructor(
    protected readonly em: EntityManager,
    protected readonly deps: DomainDependencies,
    protected readonly SqlEntity: ClassType<SqlEntity>,
  ) {
    this.repository = new EntityRepository(em, SqlEntity);
  }

  protected abstract get entityName(): string;

  protected toDomain(entity: SqlEntity | null): DomainEntity | undefined;
  protected toDomain(entities: SqlEntity[]): DomainEntity[];

  protected toDomain(arg: null | SqlEntity | SqlEntity[]) {
    if (Array.isArray(arg)) {
      return arg.map((entity) => entity.toDomain(this.deps));
    }

    return arg?.toDomain(this.deps);
  }

  protected getReference(entityId: string): SqlEntity {
    return this.repository.getReference(entityId as Primary<SqlEntity>);
  }

  protected async findOne(entityId: string): Promise<SqlEntity | null> {
    return this.repository.findOne(entityId as FilterQuery<SqlEntity>);
  }

  async findById(entityId: string): Promise<DomainEntity | undefined> {
    return this.toDomain(await this.findOne(entityId));
  }

  async findAll(): Promise<DomainEntity[]> {
    return this.toDomain(await this.repository.findAll());
  }

  async findByIdOrFail(entityId: string): Promise<DomainEntity> {
    const entity = await this.findById(entityId);

    if (!entity) {
      throw new EntityNotFound(this.entityName, entityId);
    }

    return entity;
  }

  async save(entity: DomainEntity): Promise<void> {
    const sqlEntity = (await this.findOne(entity.id)) ?? new this.SqlEntity();

    sqlEntity.assignFromDomain(this.em, entity);
    await this.repository.persistAndFlush(sqlEntity);
  }

  async delete(entity: DomainEntity): Promise<void> {
    await this.repository.removeAndFlush(this.getReference(entity.id));
  }
}

export class EntityNotFound extends BaseError<{ entityName: string; entityId: string }> {
  constructor(entityName: string, entityId: string) {
    super(`${entityName} not found`);

    this.details = {
      entityName,
      entityId,
    };
  }

  public details: { entityName: string; entityId: string };
}
