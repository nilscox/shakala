import { Markdown, Timestamp } from 'backend-domain';

import { StubDateService } from '../test/date.stub';
import { StubGeneratorService } from '../test/generator.stub';
import { InMemoryCommentRepository } from '../utils/comment.in-memory-repository';
import { createUser } from '../utils/factories';
import { InMemoryReactionRepository } from '../utils/reaction.in-memory-repository';
import { InMemoryUserRepository } from '../utils/user.in-memory-repository';

import { CreateCommentCommandHandler } from './create-comment.command';

describe('CreateCommentCommand', () => {
  const generator = new StubGeneratorService();
  const date = new StubDateService();
  const commentRepository = new InMemoryCommentRepository(new InMemoryReactionRepository());
  const userRepository = new InMemoryUserRepository();

  const handler = new CreateCommentCommandHandler(generator, date, commentRepository, userRepository);

  const user = createUser({ id: 'authorId' });
  const now = new Date('2022-01-01');

  it('creates a new comment', async () => {
    userRepository.add(user);
    generator.nextId = 'commentId';
    date.setNow(now);

    const commentId = await handler.handle({
      threadId: 'threadId',
      authorId: 'authorId',
      parentId: null,
      text: 'hello!',
    });

    expect(commentId).toEqual('commentId');

    const created = await commentRepository.findById('commentId');

    expect(created).toBeDefined();
    expect(created).toHaveProperty('id', 'commentId');
    expect(created).toHaveProperty('threadId', 'threadId');
    expect(created).toHaveProperty('author.id', 'authorId');
    expect(created).toHaveProperty('parentId', null);
    expect(created).toHaveProperty('text', Markdown.create('hello!'));
    expect(created).toHaveProperty('creationDate', Timestamp.create(now));
    expect(created).toHaveProperty('lastEditionDate', Timestamp.create(now));
  });
});
