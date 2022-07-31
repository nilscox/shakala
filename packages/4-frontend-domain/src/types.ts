import { AuthUserDto, CommentDto, ReactionTypeDto, ThreadDto, UserDto } from 'shared';
export { Sort } from 'shared';

export class ValidationError {
  constructor(public readonly fields: Array<{ field: string; error: string }>) {}
}

export class AuthorizationError {
  constructor(public readonly code: string) {}
}

export type AuthUser = AuthUserDto;
export type User = UserDto;

export type CommentForm = {
  text: string;
};

export type Thread = ThreadDto & {
  comments: Comment[];
  createCommentForm: CommentForm;
};

export type Comment = Omit<CommentDto, 'replies'> & {
  replies: Comment[];
  replyForm?: CommentForm;
  editionForm?: CommentForm;
};

export type ReactionType = ReactionTypeDto;
export const ReactionType = ReactionTypeDto;
