import { Comment, Sort, Thread } from '../types';

export type GetCommentsOptions = Partial<{
  search: string;
  sort: Sort;
}>;

export interface ThreadGateway {
  getLast(count: number): Promise<Thread[]>;
  getById(threadId: string): Promise<[Thread, Comment[]] | undefined>;
  getComments(threadId: string, option?: GetCommentsOptions): Promise<Comment[] | undefined>;
  createComment(threadId: string, text: string): Promise<string>;
}
