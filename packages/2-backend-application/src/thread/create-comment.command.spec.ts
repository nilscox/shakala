import { Markdown, Timestamp } from 'backend-domain';

import { InMemoryCommentRepository } from '../test/comment.in-memory-repository';
import { StubDateService } from '../test/date.stub';
import { createUser } from '../test/factories';
import { StubGeneratorService } from '../test/generator.stub';
import { InMemoryUserRepository } from '../test/user.in-memory-repository';

import { CreateCommentCommandHandler } from './create-comment.command';

describe('CreateCommentCommand', () => {
  const generator = new StubGeneratorService();
  const date = new StubDateService();
  const commentRepository = new InMemoryCommentRepository();
  const userRepository = new InMemoryUserRepository();

  const handler = new CreateCommentCommandHandler(generator, date, commentRepository, userRepository);

  const user = createUser({ id: 'authorId' });
  const now = new Date('2022-01-01');

  it('creates a new comment', async () => {
    userRepository.add(user);
    generator.nextId = 'commentId';
    date.setNow(now);

    await handler.handle({
      threadId: 'threadId',
      authorId: 'authorId',
      parentId: null,
      text: 'hello!',
    });

    const created = await commentRepository.findById('commentId');

    expect(created).toBeDefined();
    expect(created).toHaveProperty('id', 'commentId');
    expect(created).toHaveProperty('threadId', 'threadId');
    expect(created).toHaveProperty('author.id', 'authorId');
    expect(created).toHaveProperty('parentId', null);
    expect(created).toHaveProperty('text', Markdown.create('hello!'));
    expect(created).toHaveProperty('upvotes', 0);
    expect(created).toHaveProperty('downvotes', 0);
    expect(created).toHaveProperty('creationDate', Timestamp.create(now));
    expect(created).toHaveProperty('lastEditionDate', Timestamp.create(now));
  });
});
