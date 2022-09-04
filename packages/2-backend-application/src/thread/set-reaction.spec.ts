import { CommentService, factories, ReactionType, StubGeneratorService } from 'backend-domain';

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

  const userId = 'userId';
  const commentId = 'commentId';
  const reactionId = 'reactionId';

  beforeEach(() => {
    userRepository.add(create.user({ id: userId }));
    commentRepository.add(create.comment({ id: commentId }));
  });

  const execute = async (reactionType: ReactionType | null) => {
    await handler.handle(new SetReactionCommand(userId, commentId, reactionType));
  };

  it('creates a new reaction on a comment', async () => {
    generatorService.nextId = reactionId;

    await execute(ReactionType.upvote);

    expect(await reactionRepository.get(reactionId)).toEqual(
      create.reaction({
        id: reactionId,
        userId,
        commentId,
        type: ReactionType.upvote,
      }),
    );
  });

  it('updates an existing reaction on a comment', async () => {
    await reactionRepository.save(
      create.reaction({ id: reactionId, userId, commentId, type: ReactionType.upvote }),
    );

    await execute(ReactionType.downvote);

    expect(await reactionRepository.get(reactionId)).toHaveProperty('type', ReactionType.downvote);
  });

  it('removes a reaction on a comment', async () => {
    await reactionRepository.save(
      create.reaction({ id: reactionId, userId, commentId, type: ReactionType.upvote }),
    );

    await execute(null);

    expect(await reactionRepository.get(reactionId)).toBeUndefined();
  });
});
