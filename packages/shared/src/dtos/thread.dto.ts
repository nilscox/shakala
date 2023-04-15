import { ReactionType } from '../schemas/comment';
import { createFactory, Factory } from '../utils/create-factory';
import { omit } from '../utils/omit';
import { randomId } from '../utils/random-id';

export type AuthorDto = {
  id: string;
  nick: string;
  profileImage: string;
};

export const createAuthorDto = createFactory<AuthorDto>(() => ({
  id: randomId(),
  nick: '',
  profileImage: 'https://www.gravatar.com/avatar?default=mp',
}));

export type RootCommentDto = {
  id: string;
  author: AuthorDto;
  text: string;
  date: string;
  edited: string | false;
  history: MessageDto[];
  upvotes: number;
  downvotes: number;
  userReaction?: ReactionType;
  isSubscribed?: boolean;
  replies: ReplyDto[];
};

export type MessageDto = {
  date: string;
  text: string;
};

export const createCommentDto = createFactory<RootCommentDto>(() => ({
  id: randomId(),
  author: createAuthorDto(),
  date: '',
  edited: false,
  text: '',
  history: [],
  downvotes: 0,
  upvotes: 0,
  replies: [],
}));

export type ReplyDto = Omit<RootCommentDto, 'replies'>;
export type CommentDto = RootCommentDto | ReplyDto;

export const isReply = (comment: CommentDto | ReplyDto) => {
  return !('replies' in comment);
};

export const createReplyDto: Factory<ReplyDto> = (overrides) => {
  return omit(createCommentDto(overrides), 'replies');
};

export type ThreadDto = {
  id: string;
  author: AuthorDto;
  description: string;
  keywords: string[];
  text: string;
  date: string;
  totalComments: number;
};

export const createThreadDto = createFactory<ThreadDto>(() => ({
  id: randomId(),
  author: createAuthorDto(),
  description: '',
  keywords: [],
  text: '',
  date: '',
  totalComments: 0,
}));
