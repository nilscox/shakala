import expect from '@nilscox/expect';
import { StubDateAdapter, StubEventPublisher, Timestamp } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { Markdown } from '../../entities/markdown.value-object';
import { create } from '../../factories';
import { InMemoryThreadRepository } from '../../repositories/thread/in-memory-thread.repository';

import {
  EditThreadCommand,
  EditThreadHandler,
  ThreadEditedEvent,
  UserMustBeAuthorError,
} from './edit-thread';

describe('editThread', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('edits an existing thread', async () => {
    await test.act();

    const thread = test.getThread();

    expect.assert(thread);
    expect(thread).toHaveProperty('description', 'edited');
    expect(thread).toHaveProperty('text', new Markdown('edited'));
    expect(thread).toHaveProperty('keywords', ['edited']);
    expect(thread).toHaveProperty('created', new Timestamp('2022-01-01'));
    expect(thread).toHaveProperty('edited', new Timestamp('2022-01-02'));
  });

  it('publishes a ThreadEditedEvent', async () => {
    await test.act();

    expect(test.publisher).toHavePublished(new ThreadEditedEvent('threadId'));
  });

  it('throws a UserMustBeAuthorError when the user is not the author', async () => {
    await expect(test.act({ authorId: 'randomUserId' })).toRejectWith(UserMustBeAuthorError);
  });
});

class Test {
  thread = create.thread({
    id: 'threadId',
    authorId: 'authorId',
    description: 'initial',
    keywords: ['initial'],
    text: new Markdown('initial'),
    created: new Timestamp('2022-01-01'),
  });

  now = new Timestamp('2022-01-02');

  publisher = new StubEventPublisher();
  dateAdapter = new StubDateAdapter(this.now);
  threadRepository = new InMemoryThreadRepository([this.thread]);

  handler = new EditThreadHandler(this.dateAdapter, this.publisher, this.threadRepository);

  getThread() {
    return this.threadRepository.get('threadId');
  }

  async act(overrides?: Partial<EditThreadCommand>) {
    await this.handler.handle({
      threadId: 'threadId',
      authorId: 'authorId',
      description: 'edited',
      keywords: ['edited'],
      text: 'edited',
      ...overrides,
    });
  }
}
