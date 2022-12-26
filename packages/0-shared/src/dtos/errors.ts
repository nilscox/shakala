import { BaseError, get, UnexpectedError } from '../libs';
import { ClassType } from '../types';

import {
  EmailAlreadyExistsError,
  EmailValidationFailed,
  InvalidCredentials,
  NickAlreadyExistsError,
  NickTooShortError,
} from './authentication.dtos';
import { AuthorizationError } from './authorization.dtos';
import { InvalidDateError, NotFound } from './common.dtos';
import {
  CannotReportOwnCommentError,
  CannotSetReactionOnOwnCommentError,
  CommentAlreadyReportedError,
  CommentAlreadySubscribedError,
  CommentNotSubscribedError,
  UserMustBeAuthorError,
} from './thread.dtos';
import { InvalidImageFormat } from './user.dtos';

const errors: Record<string, ClassType<BaseError<unknown>>> = {
  AuthorizationError,
  CannotReportOwnCommentError,
  CannotSetReactionOnOwnCommentError,
  CommentAlreadyReportedError,
  CommentAlreadySubscribedError,
  CommentNotSubscribedError,
  EmailAlreadyExistsError,
  EmailValidationFailed,
  InvalidCredentials,
  InvalidDateError,
  InvalidImageFormat,
  NickAlreadyExistsError,
  NickTooShortError,
  NotFound,
  UnexpectedError,
  UserMustBeAuthorError,
};

export const parseError = (serialized: unknown) => {
  const code = get(serialized, 'code');

  if (typeof code !== 'string') {
    return;
  }

  const ErrorClass = errors[code as keyof typeof errors];

  if (!ErrorClass) {
    return;
  }

  return Object.assign(new ErrorClass(), serialized);
};
