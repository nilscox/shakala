import { createUser } from 'backend-application';
import { Nick, Timestamp } from 'backend-domain';

import { createTestDatabaseConnection } from '../mikro-orm/create-database-connection';

import { SqlUserRepository } from './sql-user.repository';

describe('SqlUserRepository', () => {
  let repository: SqlUserRepository;

  beforeEach(async () => {
    const { em } = await createTestDatabaseConnection();
    repository = new SqlUserRepository(em.fork());
  });

  it('saves and finds a user', async () => {
    const user = createUser({
      id: 'userId',
      nick: 'nick',
      email: 'user@email.tld',
      hashedPassword: 'hashed-password',
      profileImage: '/path/to/image.png',
      signupDate: '2020-01-01',
      lastLoginDate: new Timestamp('2020-01-02'),
    });

    await repository.save(user);
    expect(await repository.findById(user.id)).toEqual(user);
  });

  it('finds a user from its email', async () => {
    const user = createUser({ email: 'user@email.tld' });

    expect(await repository.findByEmail('nope')).toBeUndefined();

    await repository.save(user);
    expect(await repository.findByEmail(user.email)).toEqual(user);
  });

  it('finds a user from its nick', async () => {
    const user = createUser({ nick: 'mano' });

    expect(await repository.findByNick(new Nick('nope'))).toBeUndefined();

    await repository.save(user);
    expect(await repository.findByNick(user.nick)).toEqual(user);
  });
});
