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

export type MessageDto = {
  date: string;
  text: string;
};

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

export enum Sort {
  relevance = 'relevance',
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
}

export const isSort = isEnumValue(Sort);

export enum AuthorizationErrorReason {
  unauthenticated = 'unauthenticated',
  authenticated = 'authenticated',
  emailValidationRequired = 'emailValidationRequired',
  isReadOnly = 'isReadOnly',
}

export type HttpErrorBody = {
  /** unique error identifier */
  code: string;

  /** plain english error description */
  message: string;

  /** custom payload */
  details?: Record<string, unknown>;
};
