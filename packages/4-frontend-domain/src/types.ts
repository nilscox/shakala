import { AuthUserDto, CommentDto, ReactionTypeDto, ThreadDto, UserDto } from 'shared';
export { Sort } from 'shared';

export type FieldError = {
  field: string;
  error: string;
  value: unknown;
};

export class ValidationError extends Error {
  constructor(public readonly fields: FieldError[]) {
    super('ValidationError');
  }
}

export enum AuthorizationErrorReason {
  unauthenticated = 'unauthenticated',
  authenticated = 'authenticated',
  emailValidationRequired = 'emailValidationRequired',
}

export class AuthorizationError extends Error {
  constructor(public readonly reason: AuthorizationErrorReason | string) {
    super('AuthorizationError');
  }
}

export type FormField<Form> = keyof Form;
export type FormErrors<Form> = Partial<Record<FormField<Form>, string>>;

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
