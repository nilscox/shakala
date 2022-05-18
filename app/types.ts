export type User = {
  id: string;
  email: string;
  hashedPassword: string;
  nick: string;
  image?: string;
};

export type Comment = {
  id: string;
  author: User;
  text: string;
  date: string;
  upvotes: number;
  downvotes: number;
  repliesCount: number;
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
