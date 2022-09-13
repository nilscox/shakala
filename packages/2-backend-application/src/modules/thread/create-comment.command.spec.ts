import { factories, StubDateService, StubGeneratorService } from 'backend-domain';

import { AuthenticatedExecutionContext } from '../../utils/execution-context';

import { InMemoryCommentRepository } from './comment.in-memory-repository';
import { CreateCommentCommand, CreateCommentCommandHandler } from './create-comment.command';
import { InMemoryReactionRepository } from './reaction.in-memory-repository';

describe('CreateCommentCommand', () => {
  const generatorService = new StubGeneratorService();
  const dateService = new StubDateService();
  const commentRepository = new InMemoryCommentRepository(new InMemoryReactionRepository());

  const handler = new CreateCommentCommandHandler(generatorService, dateService, commentRepository);

  const create = factories();

  const user = create.user({ id: 'authorId' });
  const now = create.timestamp('2022-01-01');

  const execute = async (parentId: string | null = null) => {
    const command = new CreateCommentCommand('threadId', parentId, 'hello!');
    const ctx = new AuthenticatedExecutionContext(user);

    return handler.handle(command, ctx);
  };

  beforeEach(() => {
    generatorService.nextIds = ['commentId', 'messageId'];
    dateService.setNow(now);
  });

  it('creates a new root comment', async () => {
    await execute();

    const created = commentRepository.get('commentId');

    expect(created).toBeDefined();
    expect(created).toHaveProperty('id', 'commentId');
    expect(created).toHaveProperty('threadId', 'threadId');
    expect(created).toHaveProperty('author.id', 'authorId');
    expect(created).toHaveProperty('parentId', null);
    expect(created).toHaveProperty('message.id', 'messageId');
    expect(created).toHaveProperty('message.text', create.markdown('hello!'));
    expect(created).toHaveProperty('message.date', now);
    expect(created).toHaveProperty('history', []);
    expect(created).toHaveProperty('edited', false);
    expect(created).toHaveProperty('creationDate', now);
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
