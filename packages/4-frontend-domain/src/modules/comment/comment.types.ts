import { Normalized } from '@nilscox/redux-kooltik';
import { createFactory, omit, randomId, ReactionTypeDto } from 'shared';

import { createUser, User } from '../user';

export type Comment = {
  id: string;
  author: User;
  date: string;
  edited: false | string;
  text: string;
  history: CommentHistory[];
  upvotes: number;
  downvotes: number;
  userReaction?: ReactionType;
  isSubscribed?: boolean;
  replies: Reply[];
  editing: boolean;
  replying: boolean;
};

export type NormalizedComment = Normalized<Comment, 'author' | 'replies'>;

type CommentHistory = {
  date: string;
  text: string;
};

export type Reply = Omit<Comment, 'replies' | 'replying'>;

export const createComment = createFactory<Comment>(() => ({
  id: randomId(),
  author: createUser(),
  date: '',
  edited: false,
  text: '',
  history: [],
  upvotes: 0,
  downvotes: 0,
  replies: [],
  editing: false,
  replying: false,
}));

export const createReply = createFactory<Reply>(() => {
  return omit(createComment(), 'replies');
});

export type ReactionType = ReactionTypeDto;
export const ReactionType = ReactionTypeDto;
