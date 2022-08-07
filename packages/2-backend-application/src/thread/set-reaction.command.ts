import { GeneratorService, Reaction, ReactionType } from 'backend-domain';

import { CommandHandler } from '../cqs/command-handler';
import { ReactionRepository } from '../interfaces/reaction.repository';

export class SetReactionCommand {
  constructor(
    public readonly userId: string,
    public readonly commentId: string,
    public readonly reactionType: ReactionType | null,
  ) {}
}

export class SetReactionCommandHandler implements CommandHandler<SetReactionCommand> {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly reactionRepository: ReactionRepository,
  ) {}

  async handle(command: SetReactionCommand): Promise<void> {
    const { commentId, userId, reactionType } = command;

    const reaction = await this.reactionRepository.getUserReaction(commentId, userId);

    if (!reaction && reactionType) {
      const newReaction = new Reaction({
        id: await this.generatorService.generateId(),
        commentId,
        userId,
        type: reactionType,
      });

      await this.reactionRepository.save(newReaction);
    } else if (reaction) {
      if (!reactionType) {
        await this.reactionRepository.delete(reaction);
      } else {
        reaction.setType(reactionType);
        await this.reactionRepository.save(reaction);
      }
    }
  }
}
