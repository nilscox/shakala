import { ReactionType } from 'backend-domain';

import { StubGeneratorService } from '../test/generator.stub';
import { createReaction } from '../utils/factories';

import { InMemoryReactionRepository } from './reaction.in-memory-repository';
import { SetReactionCommand, SetReactionCommandHandler } from './set-reaction.command';

describe('SetReactionCommand', () => {
  const generatorService = new StubGeneratorService();
  const reactionRepository = new InMemoryReactionRepository();

  const handler = new SetReactionCommandHandler(generatorService, reactionRepository);

  const userId = 'userId';
  const commentId = 'commentId';
  const reactionId = 'reactionId';

  const execute = async (reactionType: ReactionType | null) => {
    await handler.handle(new SetReactionCommand(userId, commentId, reactionType));
  };

  it('creates a new reaction on a comment', async () => {
    generatorService.nextId = reactionId;

    await execute(ReactionType.upvote);

    expect(await reactionRepository.get(reactionId)).toEqual(
      createReaction({
        id: reactionId,
        userId,
        commentId,
        type: ReactionType.upvote,
      }),
    );
  });

  it('updates an existing reaction on a comment', async () => {
    await reactionRepository.save(
      createReaction({ id: reactionId, userId, commentId, type: ReactionType.upvote }),
    );

    await execute(ReactionType.downvote);

    expect(await reactionRepository.get(reactionId)).toHaveProperty('type', ReactionType.downvote);
  });

  it('removes a reaction on a comment', async () => {
    await reactionRepository.save(
      createReaction({ id: reactionId, userId, commentId, type: ReactionType.upvote }),
    );

    await execute(null);

    expect(await reactionRepository.get(reactionId)).toBeUndefined();
  });
});
