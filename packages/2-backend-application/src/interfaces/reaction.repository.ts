import { Reaction, ReactionsCount, ReactionType } from 'backend-domain';

import { Repository } from './repository';

export interface ReactionRepository extends Repository<Reaction> {
  countReactions(commentIds: string[]): Promise<Map<string, ReactionsCount>>;
  getUserReactions(commentIds: string[], userId: string): Promise<Map<string, ReactionType | undefined>>;
  getUserReaction(commentId: string, userId: string): Promise<Reaction | undefined>;
}
