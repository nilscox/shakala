import { CommentDto, ThreadDto, Sort } from 'shared';

export type GetCommentsOptions = Partial<{
  search: string;
  sort: Sort;
}>;

export interface ThreadGateway {
  getLast(count: number): Promise<ThreadDto[]>;
  getById(threadId: string): Promise<[ThreadDto, CommentDto[]] | undefined>;
  getComments(threadId: string, options?: GetCommentsOptions): Promise<CommentDto[] | undefined>;
  createComment(threadId: string, text: string): Promise<string>;
  createReply(threadId: string, parentId: string, text: string): Promise<string>;
}
