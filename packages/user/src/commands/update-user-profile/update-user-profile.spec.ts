import expect from '@nilscox/expect';
import { StubEventPublisher } from '@shakala/common';
import { defined } from '@shakala/shared';
import { beforeEach, describe, it } from 'vitest';

import { User } from '../../entities/user.entity';
import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/user/in-memory-user.repository';

import {
  UpdateUserProfileCommand,
  UpdateUserProfileHandler,
  UserNickChangedEvent,
} from './update-user-profile';

describe('[unit] UpdateUserProfileCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it("updates the user's nick", async () => {
    test.user = create.user({ nick: create.nick('old nick') });

    await test.act({ nick: 'Bacardi' });

    expect(test.user).toHaveProperty('nick', create.nick('Bacardi'));
  });

  it('publishes a UserNickChangedEvent', async () => {
    test.user = create.user({ nick: create.nick('old nick') });

    await test.act({ nick: 'new nick' });

    expect(test.publisher).toHavePublished(new UserNickChangedEvent(test.user, 'old nick'));
  });
});

class Test {
  publisher = new StubEventPublisher();
  userRepository = new InMemoryUserRepository();

  handler = new UpdateUserProfileHandler(this.publisher, this.userRepository);

  async act(command: Omit<UpdateUserProfileCommand, 'userId'>) {
    await this.handler.handle({ userId: this.userId, ...command });
  }

  userId = '';

  set user(user: User) {
    this.userId = user.id;
    this.userRepository.add(user);
  }

  get user() {
    return defined(this.userRepository.get(this.userId));
  }
}
