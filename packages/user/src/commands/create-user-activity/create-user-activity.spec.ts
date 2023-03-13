import { expect, StubDateAdapter, StubGeneratorAdapter, Timestamp } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { UserActivityPayload, UserActivityType } from '../../entities/user-activity.entity';
import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/user/in-memory-user.repository';
import { InMemoryUserActivityRepository } from '../../repositories/user-activity/in-memory-user-activity.repository';

import { CreateUserActivityCommand, CreateUserActivityHandler } from './create-user-activity';

describe('[unit] CreateUserActivity', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
    test.arrange();
  });

  it('creates a new user activity', async () => {
    await expect(test.act()).toResolve();

    const activity = test.activity;

    expect(activity).toBeDefined();
    expect(activity).toHaveProperty('id', 'activityId');
    expect(activity).toHaveProperty('type', UserActivityType.threadCreated);
    expect(activity).toHaveProperty('date', test.now);
    expect(activity).toHaveProperty('userId', 'userId');
    expect(activity).toHaveProperty('payload', { text: 'text' });
  });
});

class Test {
  user = create.user({
    id: 'userId',
  });

  now = new Timestamp('2022-01-01');

  generator = new StubGeneratorAdapter();
  dateAdapter = new StubDateAdapter(this.now);
  userRepository = new InMemoryUserRepository([this.user]);
  userActivityRepository = new InMemoryUserActivityRepository();

  handler = new CreateUserActivityHandler(this.generator, this.dateAdapter, this.userActivityRepository);

  arrange() {
    this.generator.nextId = 'activityId';
  }

  get activity() {
    return this.userActivityRepository.get('activityId');
  }

  static readonly defaultCommand: CreateUserActivityCommand = {
    userId: 'userId',
    type: UserActivityType.threadCreated,
    payload: { text: 'text' } as UserActivityPayload[UserActivityType],
  };

  act(overrides?: Partial<CreateUserActivityCommand>) {
    return this.handler.handle({ ...Test.defaultCommand, ...overrides });
  }
}
