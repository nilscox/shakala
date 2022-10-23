import { CommentCreatedEvent, factories, StubDateAdapter, StubGeneratorAdapter } from 'backend-domain';

import { InMemoryCommentRepository, StubEventBus } from '../../../adapters';
import { AuthenticatedExecutionContext } from '../../../utils';

import { CreateCommentCommand, CreateCommentCommandHandler } from './create-comment.command';

describe('CreateCommentCommand', () => {
  const eventBus = new StubEventBus();
  const generator = new StubGeneratorAdapter();
  const dateAdapter = new StubDateAdapter();
  const commentRepository = new InMemoryCommentRepository();

  const handler = new CreateCommentCommandHandler(eventBus, generator, dateAdapter, commentRepository);

  const create = factories();

  const user = create.user({ id: 'authorId' });
  const now = create.timestamp('2022-01-01');

  const execute = async (parentId: string | null = null) => {
    const command = new CreateCommentCommand('threadId', parentId, 'hello!');
    const ctx = new AuthenticatedExecutionContext(user);

    return handler.handle(command, ctx);
  };

  beforeEach(() => {
    generator.nextIds = ['commentId', 'messageId'];
    dateAdapter.setNow(now);
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

    expect(eventBus).toHaveEmitted(new CommentCreatedEvent('commentId'));
  });

  it('creates a new reply', async () => {
    await execute('parentId');

    const created = commentRepository.get('commentId');

    expect(created).toHaveProperty('parentId', 'parentId');

    expect(eventBus).toHaveEmitted(new CommentCreatedEvent('commentId'));
  });

  it("returns the created comment's id", async () => {
    expect(await execute()).toEqual('commentId');
  });
});