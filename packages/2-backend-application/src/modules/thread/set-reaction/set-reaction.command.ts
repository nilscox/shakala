import { CommentService, del, Reaction, ReactionType } from 'backend-domain';

import { Authorize, IsAuthenticated, HasWriteAccess } from '../../../authorization';
import { CommandHandler } from '../../../cqs';
import { CommentRepository, ReactionRepository } from '../../../interfaces';
import { AuthenticatedExecutionContext } from '../../../utils';

export class SetReactionCommand {
  constructor(public readonly commentId: string, public readonly reactionType: ReactionType | null) {}
}

@Authorize(IsAuthenticated, HasWriteAccess)
export class SetReactionCommandHandler implements CommandHandler<SetReactionCommand> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly reactionRepository: ReactionRepository,
    private readonly commentService: CommentService,
  ) {}

  async handle(command: SetReactionCommand, ctx: AuthenticatedExecutionContext): Promise<void> {
    const { commentId, reactionType } = command;
    const { user } = ctx;

    const comment = await this.commentRepository.findByIdOrFail(commentId);
    const reaction = await this.reactionRepository.getUserReaction(commentId, user.id);

    const result = await this.commentService.setUserReaction(comment, user, reaction ?? null, reactionType);

    if (result === del && reaction) {
      await this.reactionRepository.delete(reaction);
    } else if (result instanceof Reaction) {
      await this.reactionRepository.save(result);
    }
  }
}
