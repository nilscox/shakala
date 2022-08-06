import { Markdown, ThreadAuthor, Timestamp } from 'backend-domain';

import { StubDateService } from '../test/date.stub';
import { StubGeneratorService } from '../test/generator.stub';
import { InMemoryUserRepository } from '../user/user.in-memory-repository';
import { createUser } from '../utils/factories';

import { CreateThreadCommand, CreateThreadHandler } from './create-thread.command';
import { InMemoryThreadRepository } from './thread.in-memory-repository';

describe('CreateThreadCommand', () => {
  const generatorService = new StubGeneratorService();
  const dateService = new StubDateService();
  const userRepository = new InMemoryUserRepository();
  const threadRepository = new InMemoryThreadRepository();

  const handler = new CreateThreadHandler(generatorService, dateService, userRepository, threadRepository);

  const author = createUser();
  const now = new Timestamp('2022-01-01');

  beforeEach(() => {
    userRepository.add(author);
    generatorService.nextId = 'threadId';
    dateService.setNow(now);
  });

  const execute = async (description: string, text: string, keywords: string[]) => {
    return handler.handle(new CreateThreadCommand(author.id, description, text, keywords));
  };

  const description = 'description';
  const text = 'text';
  const keywords = ['key', 'words'];

  it('creates a new thread', async () => {
    await execute(description, text, keywords);

    const created = threadRepository.get('threadId');

    expect(created).toBeDefined();
    expect(created).toHaveProperty('author', new ThreadAuthor(author));
    expect(created).toHaveProperty('description', description);
    expect(created).toHaveProperty('text', new Markdown(text));
    expect(created).toHaveProperty('keywords', keywords);
    expect(created).toHaveProperty('created', now);
  });

  it("returns the created thread's id", async () => {
    expect(await execute(description, text, keywords)).toEqual('threadId');
  });
});
