import { AuthUserDto, CommentDto, ThreadDto, UserDto } from './dtos';
import { createFactory } from './libs/create-factory';
import { randomId } from './libs/random-id';

export const createAuthUserDto = createFactory<AuthUserDto>(() => ({
  id: randomId(),
  nick: '',
  email: '',
  signupDate: '',
  profileImage: undefined,
}));

export const createUserDto = createFactory<UserDto>(() => ({
  id: randomId(),
  nick: '',
  profileImage: undefined,
}));

export const createThreadDto = createFactory<ThreadDto>(() => ({
  id: randomId(),
  author: createUserDto(),
  date: '',
  text: '',
  description: '',
  keywords: [],
}));

export const createCommentDto = createFactory<CommentDto>(() => ({
  id: randomId(),
  author: createUserDto(),
  date: '',
  edited: false,
  text: '',
  history: [],
  downvotes: 0,
  upvotes: 0,
  replies: [],
}));
