import { createFactory } from '../libs/create-factory';
import { randomId } from '../libs/random-id';

export type UserDto = {
  id: string;
  nick: string;
  profileImage: string | undefined;
};

export const createUserDto = createFactory<UserDto>(() => ({
  id: randomId(),
  nick: '',
  profileImage: undefined,
}));

export type ThreadDto = {
  id: string;
  author: UserDto;
  description: string;
  keywords: string[];
  text: string;
  date: string;
};

export type ThreadWithCommentsDto = ThreadDto & {
  comments: CommentDto[];
};

export const createThreadDto = createFactory<ThreadDto>(() => ({
  id: randomId(),
  author: createUserDto(),
  date: '',
  text: '',
  description: '',
  keywords: [],
}));

export type CommentDto = {
  id: string;
  author: UserDto;
  text: string;
  date: string;
  edited: string | false;
  history: MessageDto[];
  upvotes: number;
  downvotes: number;
  userReaction?: ReactionTypeDto;
  replies?: CommentDto[];
};

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

export type MessageDto = {
  date: string;
  text: string;
};

export enum ReactionTypeDto {
  upvote = 'upvote',
  downvote = 'downvote',
}
