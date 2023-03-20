import assert from 'node:assert';

import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { EntityNotFoundError } from '@shakala/common';
import { ClassType } from '@shakala/shared';

import { Orm } from './create-orm';

export abstract class SqlRepository<Entity, SqlEntity extends object> {
  constructor(protected readonly orm: Orm) {}

  protected abstract SqlEntity: ClassType<SqlEntity>;

  protected abstract toEntity(sqlEntity: SqlEntity): Entity;
  protected abstract toSql(entity: Entity): SqlEntity;

  get em() {
    assert(this.orm, `Repository<${this.SqlEntity.name}> is not initialized`);
    return this.orm.em;
  }

  get repository(): EntityRepository<SqlEntity> {
    return this.em.getRepository(this.SqlEntity);
  }

  async findById(id: string): Promise<Entity | undefined> {
    const sqlEntity = await this.repository.findOne(id as FilterQuery<SqlEntity>);

    if (sqlEntity) {
      return this.toEntity(sqlEntity);
    }
  }

  async findByIdOrFail(id: string): Promise<Entity> {
    const sqlEntity = await this.findById(id);

    if (!sqlEntity) {
      throw new EntityNotFoundError(this.SqlEntity.constructor.name, { id });
    }

    return sqlEntity;
  }

  async save(entity: Entity): Promise<void> {
    await this.repository.upsert(this.toSql(entity));
  }
}
