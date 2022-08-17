import { Entity, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { createDomainDependencies, DomainDependencies } from 'backend-domain';

import { setupTestDatabase } from '../mikro-orm/create-database-connection';
import { EntityNotFoundError } from '../utils/entity-not-found.error';

import { BaseSqlEntity } from './base-sql-entity';
import { BaseSqlRepository } from './base-sql-repository';

type TestProps = {
  id: string;
  foo: string;
};

class Test {
  get id() {
    return this.props.id;
  }

  get foo() {
    return this.props.foo;
  }

  constructor(readonly props: TestProps) {}
}

const createTest = (overrides: Partial<TestProps>) => {
  return new Test({
    id: 'id',
    foo: '',
    ...overrides,
  });
};

@Entity()
class SqlTest extends BaseSqlEntity<Test> {
  @Property()
  foo!: string;

  assignFromDomain(_em: EntityManager, entity: Test): void {
    this.id = entity.props.id;
    this.foo = entity.props.foo;
  }

  toDomain(): Test {
    return new Test({
      id: this.id,
      foo: this.foo,
    });
  }
}

class SqlTestRepository extends BaseSqlRepository<SqlTest, Test> {
  constructor(em: EntityManager, deps: DomainDependencies) {
    super(em, deps, SqlTest);
  }

  protected get entityName(): string {
    return 'Test';
  }
}

describe('SqlRepository', () => {
  const { getEntityManager, waitForDatabaseConnection } = setupTestDatabase({ entities: [SqlTest] });

  let em: EntityManager;
  let repository: SqlTestRepository;

  beforeEach(async () => {
    await waitForDatabaseConnection();

    em = getEntityManager();
    repository = new SqlTestRepository(em, createDomainDependencies());
  });

  it('inserts a new entity to the database', async () => {
    const entity = createTest({
      id: 'testId',
      foo: 'bar',
    });

    await repository.save(entity);
    await em.clear();

    expect(await em.findOne(SqlTest, entity.id)).toMatchObject({
      id: 'testId',
      foo: 'bar',
    });
  });

  it('updates an existing entity in the database', async () => {
    const sqlTest = new SqlTest();

    sqlTest.id = 'id';
    sqlTest.foo = 'bar';

    await em.persistAndFlush(sqlTest);
    await em.clear();

    const entity = createTest({
      id: 'id',
      foo: 'updated',
    });

    await repository.save(entity);

    expect(await em.findOne(SqlTest, entity.id)).toHaveProperty('foo', 'updated');
  });

  it('retrieves an entity from the database', async () => {
    const sqlTest = new SqlTest();

    sqlTest.id = 'id';
    sqlTest.foo = 'bar';

    await em.persistAndFlush(sqlTest);
    await em.clear();

    const entity = await repository.findById(sqlTest.id);

    expect(entity?.id).toEqual('id');
    expect(entity?.foo).toEqual('bar');
  });

  it('retrieves an if it exists, or throws otherwise', async () => {
    const sqlTest = new SqlTest();

    sqlTest.id = 'id';
    sqlTest.foo = 'bar';

    await em.persistAndFlush(sqlTest);
    await em.clear();

    await expect(repository.findByIdOrFail(sqlTest.id)).resolves.toBeDefined();
    await expect(repository.findByIdOrFail('nope')).rejects.toThrow(new EntityNotFoundError('Test'));
  });

  it('deletes an entity from the database', async () => {
    const sqlTest = new SqlTest();

    sqlTest.id = 'id';
    sqlTest.foo = 'bar';

    await em.persistAndFlush(sqlTest);
    await em.clear();

    await repository.delete(await repository.findByIdOrFail(sqlTest.id));

    expect(await em.count(SqlTest)).toEqual(0);
  });
});
