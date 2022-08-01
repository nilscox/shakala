import { createAuthUserDto, createCommentDto, createThreadDto, createUserDto } from 'shared';
import { createFactory } from 'shared';

import { Comment, Thread } from '../types';

export const createAuthUser = createAuthUserDto;
export const createUser = createUserDto;

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
