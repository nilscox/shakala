import expect from '@nilscox/expect';
import { StubDateAdapter, StubEventPublisher, StubGeneratorAdapter, Timestamp } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { Markdown } from '../../entities/markdown.value-object';
import { InMemoryThreadRepository } from '../../repositories/thread/in-memory-thread.repository';

import { CreateThreadHandler, ThreadCreatedEvent } from './create-thread';

describe('createThread', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a new thread', async () => {
    await test.act();

    const created = test.getThread();

    expect.assert(created);
    expect(created).toHaveProperty('authorId', 'authorId');
    expect(created).toHaveProperty('description', 'description');
    expect(created).toHaveProperty('text', new Markdown('Hello!'));
    expect(created).toHaveProperty('keywords', ['key', 'word']);
    expect(created).toHaveProperty('created', test.now);
  });

  it('publishes a ThreadCreatedEvent', async () => {
    await test.act();

    expect(test.publisher).toHavePublished(new ThreadCreatedEvent('threadId'));
  });
});

class Test {
  now = new Timestamp('2022-01-01');

  generator = new StubGeneratorAdapter();
  publisher = new StubEventPublisher();
  dateAdapter = new StubDateAdapter(this.now);
  threadRepository = new InMemoryThreadRepository();

  handler = new CreateThreadHandler(this.dateAdapter, this.publisher, this.threadRepository);

  getThread() {
    return this.threadRepository.get('threadId');
  }

  async act() {
    await this.handler.handle({
      threadId: 'threadId',
      authorId: 'authorId',
      description: 'description',
      text: 'Hello!',
      keywords: ['key', 'word'],
    });
  }
}
