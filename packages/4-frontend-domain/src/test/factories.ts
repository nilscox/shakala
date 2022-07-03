import { createAuthUserDto, createCommentDto, createThreadDto, createUserDto } from 'shared';

import { Comment, Thread } from '../types';

// todo: move to shared
const createFactory = <T>(getDefaults: () => T) => {
  return (overrides?: Partial<T>) => ({ ...getDefaults(), ...overrides });
};

export const createAuthUser = createAuthUserDto;
export const createUser = createUserDto;

export const createThread = createFactory<Thread>(() => ({
  ...createThreadDto(),
  loadingComments: false,
  comments: [],
  createCommentForm: {
    isSubmitting: false,
    text: '',
  },
}));

export const createComment = createFactory<Comment>(() => ({
  ...createCommentDto(),
  replies: [],
}));
