import { Reaction, ReactionType } from 'backend-domain';

export type ReactionsCount = Record<ReactionType, number>;

export interface ReactionRepository {
  countReactions(commentIds: string[]): Promise<Map<string, ReactionsCount>>;
  getUserReactions(commentIds: string[], userId: string): Promise<Map<string, ReactionType | undefined>>;
  getUserReaction(commentId: string, userId: string): Promise<Reaction | undefined>;
  save(reaction: Reaction): Promise<void>;
  delete(reaction: Reaction): Promise<void>;
}
