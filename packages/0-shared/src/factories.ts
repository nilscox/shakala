import { AuthUserDto, CommentDto, ThreadDto, UserDto } from './dtos';

const createId = () => Math.random().toString(36).slice(-6);

export const createAuthUserDto = (overrides?: Partial<AuthUserDto>): AuthUserDto => ({
  id: createId(),
  nick: '',
  email: '',
  signupDate: '',
  profileImage: undefined,
  ...overrides,
});

export const createUserDto = (overrides?: Partial<UserDto>): UserDto => ({
  id: createId(),
  nick: '',
  profileImage: undefined,
  ...overrides,
});

export const createThreadDto = (overrides?: Partial<ThreadDto>): ThreadDto => ({
  id: createId(),
  author: createUserDto(),
  date: '',
  text: '',
  ...overrides,
});

export const createCommentDto = (overrides?: Partial<CommentDto>): CommentDto => ({
  id: createId(),
  author: createUserDto(),
  date: '',
  edited: false,
  text: '',
  downvotes: 0,
  upvotes: 0,
  replies: [],
  ...overrides,
});
