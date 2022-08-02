import { Reaction, ReactionType } from 'backend-domain';

import { Repository } from './repository';

export type ReactionsCount = Record<ReactionType, number>;

export interface ReactionRepository extends Repository<Reaction> {
  countReactions(commentIds: string[]): Promise<Map<string, ReactionsCount>>;
  getUserReactions(commentIds: string[], userId: string): Promise<Map<string, ReactionType | undefined>>;
  getUserReaction(commentId: string, userId: string): Promise<Reaction | undefined>;
}
