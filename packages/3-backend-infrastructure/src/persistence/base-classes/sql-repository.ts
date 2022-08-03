import { FilterQuery } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Repository } from 'backend-application';

import { EntityNotFoundError } from '../utils/entity-not-found.error';

import { EntityMapper } from './entity-mapper';

export class SqlRepository<SqlEntity, Entity extends { id: string }> implements Repository<Entity> {
  constructor(
    protected readonly repository: EntityRepository<SqlEntity>,
    private readonly entityMapper: EntityMapper<SqlEntity, Entity>,
  ) {}

  protected async findAllBy(filter: FilterQuery<SqlEntity>) {
    const sqlEntities = await this.repository.find(filter);

    return sqlEntities.map(this.fromSql);
  }

  async findAll(): Promise<Entity[]> {
    const sqlEntities = await this.repository.findAll();

    return sqlEntities.map(this.fromSql);
  }

  protected async findBy(filter: FilterQuery<SqlEntity>) {
    const sqlEntity = await this.repository.findOne(filter);

    if (!sqlEntity) {
      return;
    }

    return this.fromSql(sqlEntity);
  }

  async findById(entityId: string): Promise<Entity | undefined> {
    return this.findBy(entityId as FilterQuery<SqlEntity>);
  }

  async findByIdOrFail(entityId: string): Promise<Entity> {
    const entity = await this.findById(entityId);

    if (!entity) {
      throw new EntityNotFoundError(this.entityName);
    }

    return entity;
  }

  async save(entity: Entity): Promise<void> {
    const sqlEntity = this.toSql(entity);
    const existingSqlEntity = await this.repository.findOne(entity.id as FilterQuery<SqlEntity>);

    if (existingSqlEntity) {
      Object.assign(existingSqlEntity, sqlEntity);
      await this.repository.persistAndFlush(existingSqlEntity);
    } else {
      await this.repository.persistAndFlush(sqlEntity);
    }
  }

  async delete(entity: Entity): Promise<void> {
    await this.repository.removeAndFlush(this.toSql(entity));
  }

  private get entityName() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore let's assume you didn't see that...
    return this.repository.entityName.toString();
  }

  protected fromSql = this.entityMapper.fromSql.bind(this.entityMapper);
  protected toSql = this.entityMapper.toSql.bind(this.entityMapper);
}
