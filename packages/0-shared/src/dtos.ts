import { isEnumValue } from './libs/is-enum-value';

export type AuthUserDto = {
  id: string;
  email: string;
  nick: string;
  profileImage?: string;
  signupDate: string;
};

export type UserDto = {
  id: string;
  nick: string;
  profileImage: string | undefined;
};

export enum ReactionTypeDto {
  upvote = 'upvote',
  downvote = 'downvote',
}

export type CommentDto = {
  id: string;
  author: UserDto;
  text: string;
  date: string;
  edited: string | false;
  upvotes: number;
  downvotes: number;
  userReaction?: ReactionTypeDto;
  replies?: CommentDto[];
};

export type ThreadDto = {
  id: string;
  author: UserDto;
  text: string;
  date: string;
};

export type ThreadWithCommentsDto = ThreadDto & {
  comments: CommentDto[];
};

export enum Sort {
  relevance = 'relevance',
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
}

export const isSort = isEnumValue(Sort);
