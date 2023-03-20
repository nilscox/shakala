import expect from '@nilscox/expect';
import { Timestamp } from '@shakala/common';
import { RepositoryTest } from '@shakala/persistence';
import { beforeEach, describe, it } from 'vitest';

import { StubProfileImageAdapter } from '../../adapters/stub-profile-image.adapter';
import { create } from '../../factories';

import { SqlUserRepository } from './sql-user.repository';

describe('SqlUserRepository', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.setup();
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
      profileImage: 'email.png',
      signupDate: '1970-01-01T00:00:00.000Z',
    });
  });
});

class Test extends RepositoryTest {
  get repository() {
    return new SqlUserRepository(this.orm, new StubProfileImageAdapter());
  }
}
