import { Reaction, ReactionType } from 'backend-domain';

import { CommandHandler } from '../cqs/command-handler';
import { GeneratorService } from '../interfaces/generator.service';
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
      await this.reactionRepository.save(
        Reaction.create({
          id: await this.generatorService.generateId(),
          commentId,
          userId,
          type: reactionType,
        }),
      );
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
