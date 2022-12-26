import { BaseError } from '../libs';
import { createFactory } from '../libs/create-factory';
import { randomId } from '../libs/random-id';

export type UserDto = {
  id: string;
  nick: string;
  profileImage?: string;
};

export const createUserDto = createFactory<UserDto>(() => ({
  id: randomId(),
  nick: '',
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
  isSubscribed?: boolean;
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

export class UserMustBeAuthorError extends BaseError<{ userId: string; commentId: string }> {
  status = 403;

  constructor(userId: string, commentId: string) {
    super('user must be the author of the comment', { userId, commentId });
  }
}

export class CannotSetReactionOnOwnCommentError extends BaseError<{ commentId: string }> {
  status = 400;

  constructor(commentId: string) {
    super('user cannot set a reaction on his own comment', { commentId });
  }
}

export class CommentAlreadySubscribedError extends BaseError<{ userId: string; commentId: string }> {
  status = 400;

  constructor(userId: string, commentId: string) {
    super('a subscription to the comment already exists for the user', { userId, commentId });
  }
}

export class CommentNotSubscribedError extends BaseError<{ userId: string; commentId: string }> {
  status = 400;

  constructor(userId: string, commentId: string) {
    super('a subscription to the comment does not exists for the user', { userId, commentId });
  }
}

export class CannotReportOwnCommentError extends BaseError<{ commentId: string }> {
  status = 400;

  constructor(commentId: string) {
    super('user cannot report his own comment', { commentId });
  }
}

export class CommentAlreadyReportedError extends BaseError<{ commentId: string }> {
  status = 400;

  constructor(commentId: string) {
    super('comment already reported by user', { commentId });
  }
}
