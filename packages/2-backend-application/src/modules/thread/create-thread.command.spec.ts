import { factories, StubDateAdapter, StubGeneratorAdapter } from 'backend-domain';

import { AuthenticatedExecutionContext } from '../../utils/execution-context';

import { CreateThreadCommand, CreateThreadHandler } from './create-thread.command';
import { InMemoryThreadRepository } from './thread.in-memory-repository';

describe('CreateThreadCommand', () => {
  const generator = new StubGeneratorAdapter();
  const dateAdapter = new StubDateAdapter();
  const threadRepository = new InMemoryThreadRepository();

  const handler = new CreateThreadHandler(generator, dateAdapter, threadRepository);

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
  });

  it("returns the created thread's id", async () => {
    expect(await execute(description, text, keywords)).toEqual('threadId');
  });
});
