import { BaseError } from 'shared';

import { ReactionType } from '../modules/comment';

export const CommentAlreadyReportedError = BaseError.extend('CommentAlreadyReported');

export interface CommentGateway {
  createReply(parentId: string, text: string): Promise<string>;
  editComment(commentId: string, text: string): Promise<void>;
  setReaction(commentId: string, type: ReactionType | null): Promise<void>;
  reportComment(commentId: string, reason?: string): Promise<void>;
}
