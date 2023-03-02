import { Repository } from '@shakala/common';

import { Reaction } from '../../entities/reaction.entity';

export interface ReactionRepository extends Repository<Reaction> {
  findUserReaction(commentId: string, userId: string): Promise<Reaction | undefined>;
}
