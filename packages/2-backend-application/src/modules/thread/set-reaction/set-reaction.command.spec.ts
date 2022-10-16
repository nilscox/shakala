import {
  CannotSetReactionOnOwnCommentError,
  CommentService,
  factories,
  ReactionType,
  StubGeneratorAdapter,
  User,
} from 'backend-domain';

import { InMemoryReactionRepository, InMemoryCommentRepository } from '../../../adapters';
import { AuthenticatedExecutionContext } from '../../../utils';

import { SetReactionCommand, SetReactionCommandHandler } from './set-reaction.command';

describe('SetReactionCommand', () => {
  const generator = new StubGeneratorAdapter();
  const reactionRepository = new InMemoryReactionRepository();
  const commentRepository = new InMemoryCommentRepository(reactionRepository);
  const commentService = new CommentService(generator);

  const handler = new SetReactionCommandHandler(commentRepository, reactionRepository, commentService);

  const create = factories();

  const user = create.user();
  const author = create.user();
  const comment = create.comment({ author });
  const reactionId = 'reactionId';

  beforeEach(() => {
    commentRepository.add(comment);
  });

  const createReaction = (author: User, type: ReactionType) => {
    return create.reaction({ id: reactionId, userId: author.id, commentId: comment.id, type });
  };

  const execute = async (author: User, reactionType: ReactionType | null) => {
    const command = new SetReactionCommand(comment.id, reactionType);
    const ctx = new AuthenticatedExecutionContext(author);

    await handler.handle(command, ctx);
  };

  it('creates a new reaction on a comment', async () => {
    generator.nextId = reactionId;

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
    await expect.rejects(execute(author, ReactionType.upvote)).with(CannotSetReactionOnOwnCommentError);
  });
});
