import { ReactionType } from '../modules/comment';

export interface CommentGateway {
  createReply(parentId: string, text: string): Promise<string>;
  editComment(commentId: string, text: string): Promise<void>;
  setReaction(commentId: string, type: ReactionType | null): Promise<void>;
  subscribe(commentId: string): Promise<void>;
  unsubscribe(commentId: string): Promise<void>;
  reportComment(commentId: string, reason?: string): Promise<void>;
}
