import { factories } from 'backend-domain';

import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { SqlUserRepository } from './sql-user.repository';

describe('SqlUserRepository', () => {
  let repository: SqlUserRepository;

  const create = factories();

  const { getEntityManager } = setupTestDatabase();

  beforeEach(async () => {
    const em = getEntityManager();

    repository = new SqlUserRepository(em.fork());
  });

  it('saves and finds a user', async () => {
    const user = create.user({
      id: 'userId',
      nick: create.nick('nick'),
      email: 'user@email.tld',
      hashedPassword: 'hashed-password',
      profileImage: create.profileImage('/path/to/image.png'),
      signupDate: create.timestamp('2020-01-01'),
      lastLoginDate: create.timestamp('2020-01-02'),
    });

    await repository.save(user);
    expect(await repository.findById(user.id)).toEqual(user);
  });

  it('finds a user from its email', async () => {
    const user = create.user({ email: 'user@email.tld' });

    expect(await repository.findByEmail('nope')).toBeUndefined();

    await repository.save(user);
    expect(await repository.findByEmail(user.email)).toEqual(user);
  });

  it('finds a user from its nick', async () => {
    const user = create.user({ nick: create.nick('mano') });

    expect(await repository.findByNick(create.nick('nope'))).toBeUndefined();

    await repository.save(user);
    expect(await repository.findByNick(user.nick)).toEqual(user);
  });
});
