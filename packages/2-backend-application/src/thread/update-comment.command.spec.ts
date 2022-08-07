import { factories, StubDateService, StubGeneratorService } from 'backend-domain';

import { InMemoryUserRepository } from '../user/user.in-memory-repository';

import { InMemoryCommentRepository } from './comment.in-memory-repository';
import { InMemoryReactionRepository } from './reaction.in-memory-repository';
import { UpdateCommentCommand, UpdateCommentCommandHandler } from './update-comment.command';

describe('UpdateCommentCommand', () => {
  const generatorService = new StubGeneratorService();
  const dateService = new StubDateService();
  const userRepository = new InMemoryUserRepository();
  const commentRepository = new InMemoryCommentRepository(new InMemoryReactionRepository());

  const handler = new UpdateCommentCommandHandler(commentRepository, userRepository);

  const create = factories({ generatorService, dateService });

  const user = create.user();
  const author = create.author(user);
  const initialMessage = create.message({ author });
  const comment = create.comment({ author, message: initialMessage });
  const now = create.timestamp('2022-01-01');

  beforeEach(() => {
    generatorService.nextId = 'messageId';
    dateService.setNow(now);

    userRepository.add(user);
    commentRepository.add(comment);
  });

  const execute = async (text: string) => {
    return handler.handle(new UpdateCommentCommand(comment.id, user.id, text));
  };

  it('updates an existing comment', async () => {
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
