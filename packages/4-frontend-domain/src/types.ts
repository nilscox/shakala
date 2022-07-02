import { AuthUserDto, CommentWithRepliesDto, Sort, ThreadDto, UserDto } from 'shared';
export { Sort } from 'shared';

export class ValidationError {
  constructor(public readonly fields: Array<{ field: string; error: string }>) {}
}

export type AuthUser = AuthUserDto;
export type User = UserDto;

export type Thread = ThreadDto & {
  loadingComments: boolean;
  loadingCommentsError?: unknown;
  commentsFilter?: string;
  commentsSort?: Sort;
  comments: string[];
  createCommentForm: {
    isSubmitting: boolean;
    text: string;
  };
};

export type Comment = CommentWithRepliesDto & {
  isEditing: boolean;
};
