import { Normalized } from '@nilscox/redux-kooltik';
import { createFactory, randomId } from 'shared';

import { createDate } from '../../utils/date-utils';
import { Comment } from '../comment';
import { User, createUser } from '../user';

export type Thread = {
  id: string;
  author: User;
  date: string;
  description: string;
  keywords: string[];
  text: string;
  comments: Comment[];
};

export type NormalizedThread = Normalized<Thread, 'author' | 'comments'>;

export const createThread = createFactory<Thread>(() => ({
  id: randomId(),
  author: createUser(),
  date: createDate(),
  description: '',
  keywords: [],
  text: '',
  comments: [],
}));

export type ThreadForm = {
  description: string;
  keywords: string;
  text: string;
};

export const createThreadForm = createFactory<ThreadForm>(() => ({
  description: '',
  keywords: '',
  text: '',
}));
