import { ReactionType } from '../schemas/comment';

export type CommentDto = {
  id: string;
  author: {
    id: string;
    nick: string;
    profileImage: string;
  };
  text: string;
  date: string;
  edited: string | false;
  history: Array<{
    date: string;
    text: string;
  }>;
  upvotes: number;
  downvotes: number;
  userReaction?: ReactionType;
  isSubscribed?: boolean;
  replies: Array<Omit<CommentDto, 'replies'>>;
};

export type ThreadDto = {
  id: string;
  author: {
    id: string;
    nick: string;
    profileImage: string;
  };
  description: string;
  keywords: string[];
  text: string;
  date: string;
  comments: CommentDto[];
};
