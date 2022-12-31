import { factories, StubDateAdapter, StubGeneratorAdapter, ThreadCreatedEvent } from '@shakala/backend-domain';

import { InMemoryThreadRepository, StubEventBus } from '../../../adapters';
import { AuthenticatedExecutionContext } from '../../../utils';

import { CreateThreadCommand, CreateThreadHandler } from './create-thread.command';

describe('CreateThreadCommand', () => {
  const eventBus = new StubEventBus();
  const generator = new StubGeneratorAdapter();
  const dateAdapter = new StubDateAdapter();
  const threadRepository = new InMemoryThreadRepository();

  const handler = new CreateThreadHandler(eventBus, generator, dateAdapter, threadRepository);

  const create = factories();

  const author = create.user();
  const now = create.timestamp('2022-01-01');

  beforeEach(() => {
    generator.nextId = 'threadId';
    dateAdapter.setNow(now);
  });

  const execute = async (description: string, text: string, keywords: string[]) => {
    const command = new CreateThreadCommand(description, text, keywords);
    const ctx = new AuthenticatedExecutionContext(author);

    return handler.handle(command, ctx);
  };

  const description = 'description';
  const text = 'text';
  const keywords = ['key', 'words'];

  it('creates a new thread', async () => {
    await execute(description, text, keywords);

    const created = threadRepository.get('threadId');

    expect(created).toBeDefined();
    expect(created).toHaveProperty('author', create.author(author));
    expect(created).toHaveProperty('description', description);
    expect(created).toHaveProperty('text', create.markdown(text));
    expect(created).toHaveProperty('keywords', keywords);
    expect(created).toHaveProperty('created', now);

    expect(eventBus).toHaveEmitted(new ThreadCreatedEvent('threadId'));
  });

  it("returns the created thread's id", async () => {
    expect(await execute(description, text, keywords)).toEqual('threadId');
  });
});
