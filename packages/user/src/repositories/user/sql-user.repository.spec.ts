import expect from '@nilscox/expect';
import { Timestamp } from '@shakala/common';
import { createRepositoryTest, RepositoryTest } from '@shakala/persistence/test';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';

import { SqlUserRepository } from './sql-user.repository';

describe('SqlUserRepository', () => {
  const getTest = createRepositoryTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  it('persists a user', async () => {
    const user = create.user({ signupDate: new Timestamp(0) });

    await test.repository.save(user);
    await expect(test.repository.findById(user.id)).toResolve(user);
  });

  it('retrieves a user from its id', async () => {
    const user = create.user({
      id: 'userId',
      nick: create.nick('nick'),
      email: 'email',
      hashedPassword: 'hashedPassword',
      emailValidationToken: 'emailValidationToken',
      signupDate: new Timestamp(0),
    });

    await test.repository.save(user);

    await expect(test.repository.getUser({ id: 'userId' })).toResolve({
      id: 'userId',
      nick: 'nick',
      email: 'email',
      emailValidated: false,
      profileImage: '/user/userId/profile-image',
      signupDate: '1970-01-01T00:00:00.000Z',
    });
  });
});

class Test extends RepositoryTest {
  get repository() {
    return new SqlUserRepository(this.database);
  }
}
