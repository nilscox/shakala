import { Entity, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { createDomainDependencies, DomainDependencies } from '@shakala/backend-domain';

import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { BaseSqlEntity } from './base-sql-entity';
import { BaseSqlRepository, EntityNotFound } from './base-sql-repository';

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

describe('BaseSqlRepository', function () {
  this.timeout(5 * 1000);

  const { getEntityManager, waitForDatabaseConnection } = setupTestDatabase({
    entities: [SqlTest],
  });

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
    em.clear();

    const found = await em.findOne(SqlTest, entity.id);

    expect(found).toHaveProperty('id', 'testId');
    expect(found).toHaveProperty('foo', 'bar');
  });

  it('updates an existing entity in the database', async () => {
    const sqlTest = new SqlTest();

    sqlTest.id = 'id';
    sqlTest.foo = 'bar';

    await em.persistAndFlush(sqlTest);
    em.clear();

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
    em.clear();

    const entity = await repository.findById(sqlTest.id);

    expect(entity?.id).toEqual('id');
    expect(entity?.foo).toEqual('bar');
  });

  it('retrieves an entity if it exists, or throws otherwise', async () => {
    const sqlTest = new SqlTest();

    sqlTest.id = 'id';
    sqlTest.foo = 'bar';

    await em.persistAndFlush(sqlTest);
    em.clear();

    await expect.async(repository.findByIdOrFail(sqlTest.id)).toBeDefined();

    const error = await expect.rejects(repository.findByIdOrFail('nope')).with(EntityNotFound);

    expect(error).toHaveProperty('message', 'Test not found');
    expect(error).toHaveProperty('details.id', 'nope');
  });

  it('deletes an entity from the database', async () => {
    const sqlTest = new SqlTest();

    sqlTest.id = 'id';
    sqlTest.foo = 'bar';

    await em.persistAndFlush(sqlTest);
    em.clear();

    await repository.delete(await repository.findByIdOrFail(sqlTest.id));

    expect(await em.count(SqlTest)).toEqual(0);
  });
});
