export type AuthUser = {
  id: string;
  email: string;
  nick: string;
  profileImage?: string;
  signupDate: string;
};

export type User = {
  id: string;
  nick: string;
  profileImage?: string;
};

export type Comment = {
  id: string;
  author: User;
  text: string;
  date: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
};

export type Thread = {
  id: string;
  author: User;
  text: string;
  date: string;
  comments: Comment[];
};

export enum Sort {
  relevance = 'relevance',
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
}
