import { Author, Markdown, Timestamp } from 'backend-domain';

import { StubDateService } from '../test/date.stub';
import { StubGeneratorService } from '../test/generator.stub';
import { InMemoryUserRepository } from '../user/user.in-memory-repository';
import { createComment, createMessage, createUser } from '../utils/factories';

import { InMemoryCommentRepository } from './comment.in-memory-repository';
import { InMemoryReactionRepository } from './reaction.in-memory-repository';
import { UpdateCommentCommand, UpdateCommentCommandHandler } from './update-comment.command';

describe('UpdateCommentCommand', () => {
  const generatorService = new StubGeneratorService();
  const dateService = new StubDateService();
  const userRepository = new InMemoryUserRepository();
  const commentRepository = new InMemoryCommentRepository(new InMemoryReactionRepository());

  const handler = new UpdateCommentCommandHandler(dateService, commentRepository, userRepository);

  const user = createUser();
  const author = new Author(user);
  const initialMessage = createMessage({ author });
  const comment = createComment({ author, message: initialMessage }, generatorService);
  const now = new Timestamp('2022-01-02');

  beforeEach(() => {
    generatorService.nextId = 'messageId';
    dateService.setNow(now);

    userRepository.add(user);
    commentRepository.add(comment);
  });

  const execute = async (text: string) => {
    return handler.handle(new UpdateCommentCommand(comment.id, author.id, text));
  };

  it('updates an existing comment', async () => {
    await execute('updated');

    const edited = commentRepository.get(comment.id);

    const newMessage = createMessage({
      id: 'messageId',
      author: author,
      date: now,
      text: new Markdown('updated'),
    });

    expect(edited).toHaveProperty('message', newMessage);
    expect(edited).toHaveProperty('edited', now);
    expect(edited).toHaveProperty('history', [initialMessage]);
  });
});
