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

export type CommentDto = {
  id: string;
  author: UserDto;
  text: string;
  date: string;
  upvotes: number;
  downvotes: number;
};

export type CommentWithRepliesDto = CommentDto & {
  replies: CommentDto[];
};

export type ThreadDto = {
  id: string;
  author: UserDto;
  text: string;
  date: string;
};

export type ThreadWithCommentDto = ThreadDto & {
  comments: CommentWithRepliesDto[];
};

export enum Sort {
  relevance = 'relevance',
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
}
