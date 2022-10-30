import {
  AuthorizationErrorReason,
  AuthUserDto,
  BaseError,
  CommentDto,
  get,
  HttpErrorBody,
  NotificationDto,
  NotificationType,
  ReactionTypeDto,
  ThreadDto,
  UserActivityDto,
  UserActivityType,
  UserDto,
} from 'shared';
import * as yup from 'yup';
export { Sort } from 'shared';

export class AuthorizationError extends Error {
  constructor(public readonly reason: AuthorizationErrorReason | string) {
    super('AuthorizationError');
  }

  static from(error: HttpErrorBody) {
    const reason = get(error, 'details', 'reason');

    if (typeof reason === 'string') {
      return new AuthorizationError(reason);
    }

    return new AuthorizationError('unknown');
  }
}

export type FieldError = {
  field: string;
  error: string;
  value?: unknown;
};

const validationErrorDetailsSchema = yup.object({
  fields: yup
    .array(
      yup.object({
        field: yup.string().required(),
        error: yup.string().required(),
        value: yup.string().optional(),
      }),
    )
    .required(),
});

// prettier-ignore
const ValidationParseError = BaseError.extend('failed to parse validation error', (error: HttpErrorBody) => ({ error }));

export class ValidationError extends Error {
  constructor(public readonly fields: FieldError[]) {
    super('ValidationError');
  }

  static from(error: HttpErrorBody) {
    try {
      const details = validationErrorDetailsSchema.validateSync(error.details);

      return new ValidationError(details.fields);
    } catch {
      throw new ValidationParseError(error);
    }
  }
}

export type Paginated<T> = {
  items: T[];
  total: number;
};

export type FormField<Form> = keyof Form;
export type FormErrors<Form> = Partial<Record<FormField<Form>, string>>;

export type AuthUser = AuthUserDto;
export type User = UserDto;

export type UserActivity<Type extends UserActivityType = UserActivityType> = UserActivityDto<Type>;
export type Notification<Type extends NotificationType = NotificationType> = NotificationDto<Type>;

export type CommentForm = {
  open: boolean;
  text: string;
  submitting: boolean;
  error?: unknown;
};

export type Thread = ThreadDto & {
  comments: Comment[];
  createCommentForm: CommentForm;
};

export type Comment = Omit<CommentDto, 'replies'> & {
  replies: Comment[];
  replyForm: CommentForm;
  editionForm: CommentForm;
};

export type ReactionType = ReactionTypeDto;
export const ReactionType = ReactionTypeDto;
