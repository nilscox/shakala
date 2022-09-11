import { CommentService, del, Reaction, ReactionType } from 'backend-domain';

import { CommandHandler } from '../../cqs/command-handler';
import { CommentRepository, ReactionRepository, UserRepository } from '../../interfaces/repositories';

export class SetReactionCommand {
  constructor(
    public readonly userId: string,
    public readonly commentId: string,
    public readonly reactionType: ReactionType | null,
  ) {}
}

export class SetReactionCommandHandler implements CommandHandler<SetReactionCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
    private readonly reactionRepository: ReactionRepository,
    private readonly commentService: CommentService,
  ) {}

  async handle(command: SetReactionCommand): Promise<void> {
    const { commentId, userId, reactionType } = command;

    const user = await this.userRepository.findByIdOrFail(userId);
    const comment = await this.commentRepository.findByIdOrFail(commentId);
    const reaction = await this.reactionRepository.getUserReaction(commentId, userId);

    const result = await this.commentService.setUserReaction(comment, user, reaction ?? null, reactionType);

    if (result === del && reaction) {
      await this.reactionRepository.delete(reaction);
    } else if (result instanceof Reaction) {
      await this.reactionRepository.save(result);
    }
  }
}
