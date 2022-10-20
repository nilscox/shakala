import {
  createAuthUserDto,
  createCommentDto,
  createThreadDto,
  createUserDto,
  createFactory,
  createUserActivityDto,
} from 'shared';

import { Comment, Thread } from '../types';

export const createDate = (dateStr: string) => {
  return new Date(dateStr).toISOString();
};

export const createAuthUser = createAuthUserDto;
export const createUser = createUserDto;

export const createUserActivity = createUserActivityDto;

export const createThread = createFactory<Thread>(() => ({
  ...createThreadDto(),
  loadingComments: false,
  comments: [],
  createCommentForm: {
    text: '',
  },
}));

export const createComment = createFactory<Comment>(() => ({
  ...createCommentDto(),
  replies: [],
}));
