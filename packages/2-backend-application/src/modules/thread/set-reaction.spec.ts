import {
  CannotSetReactionOnOwnCommentError,
  CommentService,
  factories,
  ReactionType,
  StubGeneratorService,
  User,
} from 'backend-domain';

import { InMemoryUserRepository } from '../user/user.in-memory-repository';

import { InMemoryCommentRepository } from './comment.in-memory-repository';
import { InMemoryReactionRepository } from './reaction.in-memory-repository';
import { SetReactionCommand, SetReactionCommandHandler } from './set-reaction.command';

describe('SetReactionCommand', () => {
  const generatorService = new StubGeneratorService();
  const userRepository = new InMemoryUserRepository();
  const reactionRepository = new InMemoryReactionRepository();
  const commentRepository = new InMemoryCommentRepository(reactionRepository);
  const commentService = new CommentService(generatorService);

  const handler = new SetReactionCommandHandler(
    userRepository,
    commentRepository,
    reactionRepository,
    commentService,
  );

  const create = factories();

  const user = create.user();
  const author = create.user();
  const comment = create.comment({ author });
  const reactionId = 'reactionId';

  beforeEach(() => {
    userRepository.add(user);
    userRepository.add(author);
    commentRepository.add(comment);
  });

  const createReaction = (author: User, type: ReactionType) => {
    return create.reaction({ id: reactionId, userId: author.id, commentId: comment.id, type });
  };

  const execute = async (author: User, reactionType: ReactionType | null) => {
    await handler.handle(new SetReactionCommand(author.id, comment.id, reactionType));
  };

  it('creates a new reaction on a comment', async () => {
    generatorService.nextId = reactionId;

    await execute(user, ReactionType.upvote);

    expect(reactionRepository.get(reactionId)).toEqual(
      create.reaction({
        id: reactionId,
        userId: user.id,
        commentId: comment.id,
        type: ReactionType.upvote,
      }),
    );
  });

  it('updates an existing reaction on a comment', async () => {
    reactionRepository.add(createReaction(user, ReactionType.upvote));

    await execute(user, ReactionType.downvote);

    expect(reactionRepository.get(reactionId)).toHaveProperty('type', ReactionType.downvote);
  });

  it('removes a reaction on a comment', async () => {
    reactionRepository.add(createReaction(user, ReactionType.upvote));

    await execute(user, null);

    expect(reactionRepository.get(reactionId)).toBeUndefined();
  });

  it('prevents a user to set a reaction on his own comment', async () => {
    generatorService.nextId = reactionId;

    await expect(execute(author, ReactionType.upvote)).rejects.toThrow(CannotSetReactionOnOwnCommentError);
  });
});
