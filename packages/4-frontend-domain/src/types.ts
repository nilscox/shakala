import { AuthUserDto, CommentDto, Sort, ThreadDto, UserDto } from 'shared';
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
  isSubmitting: boolean;
};

export type Thread = ThreadDto & {
  loadingComments: boolean;
  loadingCommentsError?: unknown;
  commentsFilter?: string;
  commentsSort?: Sort;
  comments: string[];
  createCommentForm: CommentForm;
};

export type Comment = Omit<CommentDto, 'replies'> & {
  replies: string[];
  replyForm?: CommentForm;
  editionForm?: CommentForm;
};
