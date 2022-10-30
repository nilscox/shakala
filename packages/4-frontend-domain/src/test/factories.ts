import {
  createAuthUserDto,
  createCommentDto,
  createFactory,
  createNotificationDto,
  createThreadDto,
  createUserActivityDto,
  createUserDto,
} from 'shared';

import { Comment, CommentForm, Thread } from '../types';

export const createDate = (dateStr: string) => {
  return new Date(dateStr).toISOString();
};

export const createAuthUser = createAuthUserDto;
export const createUser = createUserDto;

export const createUserActivity = createUserActivityDto;
export const createNotification = createNotificationDto;

export const createThread = createFactory<Thread>(() => ({
  ...createThreadDto(),
  loadingComments: false,
  comments: [],
  createCommentForm: createCommentForm(),
}));

export const createComment = createFactory<Comment>(() => ({
  ...createCommentDto(),
  replies: [],
  replyForm: createCommentForm(),
  editionForm: createCommentForm(),
}));

export const createCommentForm = createFactory<CommentForm>(() => ({
  open: false,
  text: '',
  submitting: false,
  error: undefined,
}));
