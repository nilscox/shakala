import { factories, StubDateAdapter, StubGeneratorAdapter } from 'backend-domain';

import { AuthenticatedExecutionContext } from '../../utils/execution-context';

import { InMemoryCommentRepository } from './comment.in-memory-repository';
import { EditCommentCommand, EditCommentCommandHandler } from './edit-comment.command';

describe('EditCommentCommand', () => {
  const generator = new StubGeneratorAdapter();
  const dateAdapter = new StubDateAdapter();
  const commentRepository = new InMemoryCommentRepository();

  const handler = new EditCommentCommandHandler(commentRepository);

  const create = factories({ generator, date: dateAdapter });

  const user = create.user();
  const author = create.author(user);
  const initialMessage = create.message({ author });
  const comment = create.comment({ author, message: initialMessage });
  const now = create.timestamp('2022-01-01');

  beforeEach(() => {
    generator.nextId = 'messageId';
    dateAdapter.setNow(now);
    commentRepository.add(comment);
  });

  const execute = async (text: string) => {
    const command = new EditCommentCommand(comment.id, text);
    const ctx = new AuthenticatedExecutionContext(user);

    return handler.handle(command, ctx);
  };

  it("edits an existing comment's message", async () => {
    await execute('updated');

    const edited = commentRepository.get(comment.id);

    const newMessage = create.message({
      id: 'messageId',
      author,
      date: now,
      text: create.markdown('updated'),
    });

    expect(edited).toHaveProperty('message', newMessage);
    expect(edited).toHaveProperty('edited', now);
    expect(edited).toHaveProperty('history', [initialMessage]);
  });
});
