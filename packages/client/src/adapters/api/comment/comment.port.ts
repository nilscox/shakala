import { CommentDto, Maybe, ReactionType } from '@shakala/shared';

export interface CommentPort {
  getComment(commentId: string): Promise<Maybe<CommentDto>>;
  createComment(threadId: string, text: string): Promise<string>;
  createReply(parentId: string, text: string): Promise<string>;
  editComment(commentId: string, text: string): Promise<void>;
  setReaction(commentId: string, reaction: ReactionType | null): Promise<void>;
  setSubscription(commentId: string, subscribed: boolean): Promise<void>;
  reportComment(commentId: string, reason?: string): Promise<void>;
}
