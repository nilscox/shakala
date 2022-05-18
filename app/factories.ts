import { Comment, Thread, User } from './types';

const randomId = () => Math.random().toString(32).slice(-4);

export const createDate = (dateStr?: string) => {
  if (!dateStr) {
    return new Date('2022-01-01').toISOString();
  }

  return new Date(dateStr).toISOString();
};

export const createUser = (overrides?: Partial<User>): User => ({
  id: randomId(),
  nick: '',
  email: '',
  hashedPassword: '',
  ...overrides,
});

export const createComment = (overrides?: Partial<Comment>): Comment => ({
  id: randomId(),
  author: createUser(),
  text: '',
  date: createDate(),
  upvotes: 0,
  downvotes: 0,
  repliesCount: overrides?.replies?.length ?? 0,
  replies: [],
  ...overrides,
});

export const createThread = (overrides?: Partial<Thread>): Thread => ({
  id: randomId(),
  author: createUser(),
  text: '',
  date: createDate(),
  comments: [],
  ...overrides,
});
