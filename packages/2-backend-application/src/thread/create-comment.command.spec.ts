import { Markdown, Timestamp } from 'backend-domain';

import { StubDateService } from '../test/date.stub';
import { StubGeneratorService } from '../test/generator.stub';
import { InMemoryUserRepository } from '../user/user.in-memory-repository';
import { createUser } from '../utils/factories';

import { InMemoryCommentRepository } from './comment.in-memory-repository';
import { CreateCommentCommandHandler } from './create-comment.command';
import { InMemoryReactionRepository } from './reaction.in-memory-repository';

describe('CreateCommentCommand', () => {
  const generator = new StubGeneratorService();
  const date = new StubDateService();
  const commentRepository = new InMemoryCommentRepository(new InMemoryReactionRepository());
  const userRepository = new InMemoryUserRepository();

  const handler = new CreateCommentCommandHandler(generator, date, commentRepository, userRepository);

  const user = createUser({ id: 'authorId' });
  const now = new Timestamp('2022-01-01');

  const execute = async (parentId: string | null = null) => {
    return handler.handle({
      threadId: 'threadId',
      authorId: 'authorId',
      parentId,
      text: 'hello!',
    });
  };

  beforeEach(() => {
    userRepository.add(user);
    generator.nextId = 'commentId';
    date.setNow(now);
  });

  it('creates a new root comment', async () => {
    await execute();

    const created = commentRepository.get('commentId');

    expect(created).toBeDefined();
    expect(created).toHaveProperty('id', 'commentId');
    expect(created).toHaveProperty('threadId', 'threadId');
    expect(created).toHaveProperty('author.id', 'authorId');
    expect(created).toHaveProperty('parentId', null);
    expect(created).toHaveProperty('text', new Markdown('hello!'));
    expect(created).toHaveProperty('creationDate', now);
    expect(created).toHaveProperty('lastEditionDate', now);
  });

  it('creates a new reply', async () => {
    await execute('parentId');

    const created = commentRepository.get('commentId');

    expect(created).toHaveProperty('parentId', 'parentId');
  });

  it("returns the created comment's id", async () => {
    expect(await execute()).toEqual('commentId');
  });
});
