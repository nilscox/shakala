import { EntityManager } from '@mikro-orm/postgresql';
import { createUser } from 'backend-application';
import { Nick } from 'backend-domain';

import { User as SqlUser } from '../entities/sql-user.entity';
import { createTestDatabaseConnection } from '../mikro-orm/create-database-connection';
import { SqlUserRepository } from '../repositories/sql-user.repository';
import { EntityNotFoundError } from '../utils/entity-not-found.error';

const createSqlEntity = async (em?: EntityManager) => {
  const sqlEntity = new SqlUser();

  sqlEntity.id = 'userId';
  sqlEntity.nick = 'nick';
  sqlEntity.email = '';
  sqlEntity.hashedPassword = '';
  sqlEntity.signupDate = new Date();

  if (em) {
    await em.persist(sqlEntity);
    await em.flush();
  }

  return sqlEntity;
};

describe('SqlRepository', () => {
  let em: EntityManager;
  let repository: SqlUserRepository;

  beforeEach(async () => {
    const orm = await createTestDatabaseConnection();

    em = orm.em.fork();
    repository = new SqlUserRepository(em);
  });

  it('saves an entity to the database', async () => {
    const entity = createUser({
      id: 'userId',
      nick: 'nick',
      profileImage: '/path/to/image.png',
    });

    await repository.save(entity);

    expect(await em.findOne(SqlUser, entity.id)).toMatchObject({
      id: 'userId',
      nick: 'nick',
      profileImage: '/path/to/image.png',
    });
  });

  it('retrieves an entity from the database', async () => {
    const sqlEntity = await createSqlEntity(em);

    const entity = await repository.findById(sqlEntity.id);

    expect(entity?.id).toEqual('userId');
    expect(entity?.nick).toEqual(new Nick('nick'));
  });

  it('retrieves an if it exists, or throws otherwise', async () => {
    const sqlEntity = await createSqlEntity(em);

    await expect(repository.findByIdOrFail(sqlEntity.id)).resolves.toBeDefined();
    await expect(repository.findByIdOrFail('nope')).rejects.toThrow(new EntityNotFoundError('User'));
  });

  it('deletes an entity from the database', async () => {
    const sqlEntity = await createSqlEntity(em);

    await repository.delete(await repository.findByIdOrFail(sqlEntity.id));

    expect(await em.count(SqlUser)).toEqual(0);
  });
});
