import {
  BaseError,
  commandCreator,
  CommandHandler,
  DomainEvent,
  EventPublisher,
  GeneratorPort,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { ReactionType, Reaction } from '../../entities/reaction.entity';
import { CommentRepository } from '../../repositories/comment/comment.repository';
import { ReactionRepository } from '../../repositories/reaction/reaction.repository';
import { THREAD_TOKENS } from '../../tokens';

export type SetReactionCommand = {
  commentId: string;
  userId: string;
  reactionType: ReactionType | null;
};

const symbol = Symbol('SetReactionCommand');
export const setReaction = commandCreator<SetReactionCommand>(symbol);

export class SetReactionHandler implements CommandHandler<SetReactionCommand> {
  symbol = symbol;

  constructor(
    private readonly generator: GeneratorPort,
    private readonly publisher: EventPublisher,
    private readonly commentRepository: CommentRepository,
    private readonly reactionRepository: ReactionRepository
  ) {}

  async handle(command: SetReactionCommand): Promise<void> {
    const { commentId, userId, reactionType: nextReaction } = command;

    const comment = await this.commentRepository.findByIdOrFail(commentId);
    const reaction = await this.reactionRepository.findUserReaction(commentId, userId);
    const currentReaction = reaction?.type;

    if (userId === comment.authorId) {
      throw new CannotSetReactionOnOwnCommentError(comment.id);
    }

    if (!currentReaction && nextReaction) {
      const newReaction = new Reaction({
        id: await this.generator.generateId(),
        commentId: comment.id,
        userId: userId,
        type: nextReaction,
      });

      await this.reactionRepository.save(newReaction);
    } else if (currentReaction) {
      if (!nextReaction) {
        await this.reactionRepository.delete(reaction);
      } else {
        reaction.type = nextReaction;

        await this.reactionRepository.save(reaction);
      }
    }

    this.publisher.publish(
      new CommentReactionChangedEvent(commentId, userId, currentReaction ?? null, nextReaction ?? null)
    );
  }
}

injected(
  SetReactionHandler,
  TOKENS.generator,
  TOKENS.publisher,
  THREAD_TOKENS.commentRepository,
  THREAD_TOKENS.reactionRepository
);

export class CannotSetReactionOnOwnCommentError extends BaseError<{ commentId: string }> {
  status = 400;

  constructor(commentId: string) {
    super('user cannot set a reaction on his own comment', { commentId });
  }
}

export class CommentReactionChangedEvent extends DomainEvent {
  constructor(
    commentId: string,
    public readonly userId: string,
    public readonly prevReaction: ReactionType | null,
    public readonly nextReaction: ReactionType | null
  ) {
    super('Comment', commentId);
  }
}